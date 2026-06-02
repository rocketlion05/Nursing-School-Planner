import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import {
  PROVIDERS,
  isProviderId,
  isProviderConfigured,
  getRedirectUri,
} from '@/app/lib/oauth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params

  if (!isProviderId(provider)) {
    return NextResponse.redirect(new URL('/login?error=unknown_provider', _req.nextUrl.origin))
  }
  if (!isProviderConfigured(provider)) {
    return NextResponse.redirect(
      new URL(`/login?error=provider_unconfigured&p=${provider}`, _req.nextUrl.origin),
    )
  }

  const config = PROVIDERS[provider]
  const state = crypto.randomUUID()

  const cookieStore = await cookies()
  cookieStore.set('oauth_state', `${provider}:${state}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes to complete the flow
    path: '/',
  })

  const authUrl = new URL(config.authorizeUrl)
  authUrl.searchParams.set('client_id', config.clientId!)
  authUrl.searchParams.set('redirect_uri', getRedirectUri(provider))
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', config.scope)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'select_account')

  return NextResponse.redirect(authUrl)
}
