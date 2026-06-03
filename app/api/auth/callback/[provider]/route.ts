import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/app/lib/session'
import {
  PROVIDERS,
  isProviderId,
  isProviderConfigured,
  getRedirectUri,
  parseUserInfo,
  type ProviderId,
} from '@/app/lib/oauth'
import { sendWelcomeEmail } from '@/lib/email'

function loginError(origin: string, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}`, origin))
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const origin = req.nextUrl.origin
  const { provider } = await params

  if (!isProviderId(provider) || !isProviderConfigured(provider)) {
    return loginError(origin, 'unknown_provider')
  }

  const url = req.nextUrl
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  // Validate the CSRF state against the cookie set when the flow started.
  const cookieStore = await cookies()
  const stored = cookieStore.get('oauth_state')?.value
  cookieStore.delete('oauth_state')
  if (!code || !state || stored !== `${provider}:${state}`) {
    return loginError(origin, 'oauth_state')
  }

  const config = PROVIDERS[provider]

  try {
    // 1. Exchange the authorization code for tokens.
    const tokenRes = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId!,
        client_secret: config.clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: getRedirectUri(provider),
      }),
    })
    if (!tokenRes.ok) {
      console.error('OAuth token exchange failed:', provider, await tokenRes.text())
      return loginError(origin, 'oauth_token')
    }
    const tokens = (await tokenRes.json()) as { access_token?: string }
    if (!tokens.access_token) return loginError(origin, 'oauth_token')

    // 2. Fetch the user's profile.
    const infoRes = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    if (!infoRes.ok) {
      console.error('OAuth userinfo failed:', provider, await infoRes.text())
      return loginError(origin, 'oauth_userinfo')
    }
    const info = parseUserInfo((await infoRes.json()) as Record<string, unknown>)
    if (!info.providerAccountId) return loginError(origin, 'oauth_userinfo')

    // 3. Resolve to a User and sign in.
    const { userId, isNew, email: userEmail } = await resolveUser(provider, info)
    await createSession(userId)
    if (isNew && userEmail) sendWelcomeEmail(userEmail).catch(() => {})
    return NextResponse.redirect(new URL('/dashboard', origin))
  } catch (err) {
    console.error('OAuth callback error:', provider, err)
    return loginError(origin, 'oauth_failed')
  }
}

type ResolvedUser = { userId: string; isNew: boolean; email: string | null }

async function resolveUser(
  provider: ProviderId,
  info: { providerAccountId: string; email: string | null; name: string },
): Promise<ResolvedUser> {
  // Already linked? Sign straight in.
  const linked = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: { provider, providerAccountId: info.providerAccountId },
    },
    select: { userId: true },
  })
  if (linked) return { userId: linked.userId, isNew: false, email: info.email }

  // Link to an existing account with the same email, if any.
  if (info.email) {
    const existing = await prisma.user.findUnique({
      where: { email: info.email },
      select: { id: true },
    })
    if (existing) {
      await prisma.oAuthAccount.create({
        data: { provider, providerAccountId: info.providerAccountId, userId: existing.id },
      })
      return { userId: existing.id, isNew: false, email: info.email }
    }
  }

  // Otherwise create a fresh account (no password — social login only).
  const email = info.email ?? `${provider}_${info.providerAccountId}@users.noreply.local`
  const username = await uniqueUsername(provider, info, email)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      name: info.name,
      oauthAccounts: {
        create: { provider, providerAccountId: info.providerAccountId },
      },
    },
    select: { id: true },
  })
  return { userId: user.id, isNew: true, email: info.email }
}

/** Derives a unique username from the email/name, appending digits on collision. */
async function uniqueUsername(
  provider: ProviderId,
  info: { name: string },
  email: string,
): Promise<string> {
  const base =
    (email.split('@')[0] || info.name || provider)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 16) || provider
  let candidate = base
  for (let i = 0; i < 50; i++) {
    const taken = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })
    if (!taken) return candidate
    candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`
  }
  return `${base}${crypto.randomUUID().slice(0, 8)}`
}
