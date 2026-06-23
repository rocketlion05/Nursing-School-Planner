/**
 * Regenerates the app favicons so the logo mark sits on a SOLID WHITE CIRCLE
 * that reads cleanly on any background — including Google's dark-mode search
 * results, where the old transparent-background mark looked muddy.
 *
 * Outputs: app/icon.png (512), app/apple-icon.png (180), app/favicon.ico (16/32/48).
 * Source artwork: public/logo-mark.png (the clipboard + stethoscope mark).
 *
 * Run once with:  npx tsx scripts/make-favicon.ts
 */
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SOURCE = path.join(ROOT, 'public', 'logo-mark.png')
const SIZE = 512
const MARK_RATIO = 0.7 // mark fills 70% of the circle, leaving a clean white margin

async function buildBadge(size: number): Promise<Buffer> {
  // Solid white circle filling the frame (transparent corners so it reads as a
  // circular badge on dark UIs that don't already clip to a circle).
  const r = size / 2
  const circle = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <circle cx="${r}" cy="${r}" r="${r}" fill="#ffffff"/>
     </svg>`,
  )

  const markSize = Math.round(size * MARK_RATIO)
  const mark = await sharp(SOURCE)
    .resize(markSize, markSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer()

  return sharp(circle)
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer()
}

async function main() {
  const icon512 = await buildBadge(SIZE)
  await fs.writeFile(path.join(ROOT, 'app', 'icon.png'), icon512)

  const apple = await sharp(icon512).resize(180, 180).png().toBuffer()
  await fs.writeFile(path.join(ROOT, 'app', 'apple-icon.png'), apple)

  // favicon.ico bundles a few small sizes for legacy/browser-chrome use.
  const ico = await pngToIco([
    await sharp(icon512).resize(48, 48).png().toBuffer(),
    await sharp(icon512).resize(32, 32).png().toBuffer(),
    await sharp(icon512).resize(16, 16).png().toBuffer(),
  ])
  await fs.writeFile(path.join(ROOT, 'app', 'favicon.ico'), ico)

  console.log('Wrote app/icon.png (512), app/apple-icon.png (180), app/favicon.ico (16/32/48).')
}

main().catch(e => { console.error(e); process.exit(1) })
