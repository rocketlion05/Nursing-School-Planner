import 'server-only'

export type ProviderId = 'google' | 'microsoft'

type ProviderConfig = {
  id: ProviderId
  label: string
  authorizeUrl: string
  tokenUrl: string
  userInfoUrl: string
  scope: string
  clientId?: string
  clientSecret?: string
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  google: {
    id: 'google',
    label: 'Google',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  microsoft: {
    id: 'microsoft',
    label: 'Microsoft',
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/oidc/userinfo',
    scope: 'openid email profile',
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
}

export function isProviderId(value: string): value is ProviderId {
  return value === 'google' || value === 'microsoft'
}

/** A provider is usable only once its client id + secret are configured. */
export function isProviderConfigured(id: ProviderId): boolean {
  const p = PROVIDERS[id]
  return Boolean(p.clientId && p.clientSecret)
}

export function getRedirectUri(id: ProviderId): string {
  const base =
    process.env.OAUTH_REDIRECT_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
  return `${base}/api/auth/callback/${id}`
}

export type OAuthUserInfo = {
  providerAccountId: string
  email: string | null
  name: string
}

/** Normalizes the OIDC userinfo payload from either provider. */
export function parseUserInfo(raw: Record<string, unknown>): OAuthUserInfo {
  const sub = typeof raw.sub === 'string' ? raw.sub : ''
  const email =
    (typeof raw.email === 'string' && raw.email) ||
    (typeof raw.preferred_username === 'string' && raw.preferred_username.includes('@')
      ? (raw.preferred_username as string)
      : null)
  const name =
    (typeof raw.name === 'string' && raw.name) ||
    (typeof raw.given_name === 'string' ? (raw.given_name as string) : '') ||
    ''
  return { providerAccountId: sub, email: email ? email.toLowerCase() : null, name }
}
