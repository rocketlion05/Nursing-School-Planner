import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const contentType = 'image/png'

function n(v: string | null): number {
  const x = parseInt(v ?? '0', 10)
  return Number.isFinite(x) && x >= 0 ? x : 0
}

// Branded, screenshot-ready result card for the chances calculator. Square
// (1080) by default — the format students post to IG / TikTok / Pinterest — with
// a `format=wide` (1200x630) variant for link/OG previews. Used as a downloadable
// image and as the native share payload.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const safe = n(searchParams.get('safe'))
  const match = n(searchParams.get('match'))
  const reach = n(searchParams.get('reach'))
  const steps = n(searchParams.get('steps'))
  const state = (searchParams.get('state') ?? '').slice(0, 16)
  const wide = searchParams.get('format') === 'wide'
  const competitive = safe + match

  const headline = competitive > 0
    ? `I'm a Safe or Match for ${competitive} BSN program${competitive === 1 ? '' : 's'}`
    : 'I just checked my nursing school chances'

  const eyebrow = state ? `My Nursing School Chances · ${state}` : 'My Nursing School Chances'

  // label, value, number color
  const tiles: [string, number, string][] = [
    ['Safe', safe, '#86efac'],
    ['Match', match, '#93c5fd'],
    ['Reach', reach, '#fcd34d'],
    ['Needs steps', steps, '#fca5a5'],
  ]

  const W = wide ? 1200 : 1080
  const H = wide ? 630 : 1080

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
          fontFamily: 'sans-serif', padding: wide ? '60px 72px' : '76px 72px',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand + headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: wide ? 26 : 30, color: '#5eead4', fontWeight: 700, marginBottom: wide ? 22 : 30 }}>
            Nursing School Planner
          </div>
          <div style={{ display: 'flex', fontSize: wide ? 24 : 28, color: '#99f6e4', fontWeight: 600, marginBottom: 14 }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', fontSize: wide ? 58 : 70, fontWeight: 800, color: 'white', lineHeight: 1.08, maxWidth: W - 144 }}>
            {headline}
          </div>
        </div>

        {/* Stat tiles — 2x2 on square, single row on wide */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {tiles.map(([label, value, color]) => (
            <div
              key={label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.12)', borderRadius: 24,
                padding: wide ? '22px 0' : '30px 0',
                flexGrow: 1, flexBasis: wide ? 0 : '44%',
              }}
            >
              <div style={{ display: 'flex', fontSize: wide ? 64 : 84, fontWeight: 800, color }}>{String(value)}</div>
              <div style={{ display: 'flex', fontSize: wide ? 24 : 28, color: 'white', marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: wide ? 26 : 32, color: 'white', fontWeight: 700 }}>
            Check your chances free
          </div>
          <div style={{ display: 'flex', fontSize: wide ? 24 : 27, color: '#99f6e4', marginTop: 4, fontWeight: 600 }}>
            nursingschoolplanner.com/chance-calculator
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  )
}
