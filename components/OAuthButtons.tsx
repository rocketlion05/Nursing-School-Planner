import { PROVIDERS, isProviderConfigured, type ProviderId } from '@/app/lib/oauth'

const ORDER: ProviderId[] = ['google', 'microsoft']

export default function OAuthButtons() {
  return (
    <div className="space-y-2">
      {ORDER.map(id => {
        const provider = PROVIDERS[id]
        const configured = isProviderConfigured(id)
        return (
          <a
            key={id}
            href={configured ? `/api/auth/${id}` : undefined}
            aria-disabled={!configured}
            title={configured ? undefined : `${provider.label} sign-in isn't configured yet`}
            className={`flex items-center justify-center gap-2 w-full border rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              configured
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue with {provider.label}
          </a>
        )
      })}
    </div>
  )
}
