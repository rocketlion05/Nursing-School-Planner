import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const contentType = 'image/png'

function n(v: string | null): number {
  const x = parseInt(v ?? '0', 10)
  return Number.isFinite(x) && x >= 0 ? x : 0
}

// Branded, screenshot-ready result card for the chances calculator. Used both as
// the OG image when a result link is shared and as a downloadable image.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const safe = n(searchParams.get('safe'))
  const match = n(searchParams.get('match'))
  const reach = n(searchParams.get('reach'))
  const steps = n(searchParams.get('steps'))
  const state = (searchParams.get('state') ?? '').slice(0, 16)
  const competitive = safe + match

  const headline = competitive > 0
    ? `I'm a Safe or Match for ${competitive} BSN program${competitive === 1 ? '' : 's'}!`
    : 'I just checked my nursing school chances'

  const tiles: [string, number, string][] = [
    ['Safe', safe, '#bbf7d0'],
    ['Match', match, '#bfdbfe'],
    ['Reach', reach, '#fde68a'],
    ['Needs steps', steps, '#fecaca'],
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
          fontFamily: 'sans-serif', padding: '64px 72px', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, color: '#99f6e4', fontWeight: 600, marginBottom: 18 }}>
            Nursing School Chances{state ? ` · ${state}` : ''}
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, color: 'white', lineHeight: 1.1, maxWidth: 980 }}>
            {headline}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {tiles.map(([label, value, color]) => (
            <div
              key={label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '24px 0', flex: 1,
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 24, color: 'white', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 26, color: 'white', fontWeight: 600 }}>
            Check yours free → nursingschoolplanner.com
          </div>
          <div style={{ fontSize: 22, color: '#99f6e4' }}>/chance-calculator</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
