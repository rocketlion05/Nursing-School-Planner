'use client'

import { track } from '@vercel/analytics'
import { Share2, ImageDown } from 'lucide-react'

/**
 * "Save image" + "Share" buttons for a nursing-chances result. Downloads or
 * natively shares the branded square card from /chance-calculator/result-image
 * (so it drops straight into IG / TikTok / Messages), falling back to sharing a
 * link, then copying it. Reused by the public calculator and the logged-in plan.
 */
export default function ShareChancesButtons({
  imageParams,
  sharePath,
  competitive,
}: {
  /** Query string for the result-image route, e.g. "safe=4&match=6&reach=3&steps=2". */
  imageParams: string
  /** Path to share as the link fallback (e.g. the public calculator). */
  sharePath: string
  /** Safe + Match count, for the share caption. */
  competitive: number
}) {
  const imageUrl = `/chance-calculator/result-image?${imageParams}`

  async function fetchCard(): Promise<File | null> {
    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      return new File([blob], 'nursing-school-chances.png', { type: 'image/png' })
    } catch {
      return null
    }
  }

  async function downloadImage() {
    const file = await fetchCard()
    if (!file) { window.open(imageUrl, '_blank'); return }
    const href = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = href
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(href)
    track('share_card', { action: 'download' })
  }

  async function share() {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${origin}${sharePath}`
    const text = `I checked my nursing school chances, and I'm a Safe or Match for ${competitive} BSN program${competitive === 1 ? '' : 's'}!`
    try {
      // Prefer sharing the actual image file, so it drops straight into IG / TikTok / Messages.
      const file = await fetchCard()
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (file && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: 'My Nursing School Chances', text })
        track('share_card', { action: 'share_image' })
        return
      }
      if (navigator.share) {
        await navigator.share({ title: 'My Nursing School Chances', text, url })
        track('share_card', { action: 'share_link' })
        return
      }
      await navigator.clipboard.writeText(url)
      alert('Share link copied!')
      track('share_card', { action: 'copy_link' })
    } catch { /* user dismissed */ }
  }

  return (
    <div className="flex items-center gap-3 shrink-0">
      <button
        onClick={downloadImage}
        className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900 font-medium"
        title="Download a shareable image of your result"
      >
        <ImageDown className="w-4 h-4" /> Save image
      </button>
      <button onClick={share} className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900 font-medium">
        <Share2 className="w-4 h-4" /> Share
      </button>
    </div>
  )
}
