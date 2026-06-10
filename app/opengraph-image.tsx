import { ImageResponse } from 'next/og'

export const alt = 'Nursing School Planner — Navigate Your Path to Nursing School'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            marginBottom: 28,
            lineHeight: 1.15,
          }}
        >
          Nursing School Planner
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#99f6e4',
            textAlign: 'center',
            maxWidth: 780,
            lineHeight: 1.5,
          }}
        >
          Compare your GPA and prerequisites against BSN program requirements in Arkansas and Texas.
        </div>
        <div
          style={{
            marginTop: 48,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            padding: '14px 36px',
            color: 'white',
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          nursingschoolplanner.com
        </div>
      </div>
    ),
    { ...size },
  )
}
