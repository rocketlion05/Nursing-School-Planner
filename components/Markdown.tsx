// Lightweight server-side markdown renderer for guide articles. Supports
// #/##/### headings, - and 1. lists, **bold**, [links](url), and paragraphs.
// Intentionally minimal (no dependency) — guides are authored by us / the SEO
// routine in a constrained subset.
import Link from 'next/link'
import type { ReactNode } from 'react'

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // Split on **bold** and [text](url) tokens.
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return tokens.map((tok, i) => {
    const bold = tok.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={`${keyPrefix}-${i}`} className="font-semibold text-gray-900">{bold[1]}</strong>
    const link = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const href = link[2]
      const external = /^https?:\/\//.test(href)
      return external ? (
        <a key={`${keyPrefix}-${i}`} href={href} target="_blank" rel="noopener" className="text-teal-600 hover:text-teal-800 underline">
          {link[1]}
        </a>
      ) : (
        <Link key={`${keyPrefix}-${i}`} href={href} className="text-teal-600 hover:text-teal-800 underline">
          {link[1]}
        </Link>
      )
    }
    return <span key={`${keyPrefix}-${i}`}>{tok}</span>
  })
}

export default function Markdown({ body }: { body: string }) {
  const lines = body.split('\n')
  const blocks: ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  const flushList = () => {
    if (!list) return
    const items = list.items.map((it, i) => <li key={i}>{renderInline(it, `li-${blocks.length}-${i}`)}</li>)
    blocks.push(
      list.ordered ? (
        <ol key={`b-${blocks.length}`} className="list-decimal pl-6 space-y-1.5 text-gray-700">{items}</ol>
      ) : (
        <ul key={`b-${blocks.length}`} className="list-disc pl-6 space-y-1.5 text-gray-700">{items}</ul>
      ),
    )
    list = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) { flushList(); continue }

    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushList()
      const level = h[1].length
      const content = renderInline(h[2], `h-${blocks.length}`)
      if (level <= 2) blocks.push(<h2 key={`b-${blocks.length}`} className="text-xl font-bold text-gray-900 mt-8 mb-3">{content}</h2>)
      else blocks.push(<h3 key={`b-${blocks.length}`} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{content}</h3>)
      continue
    }

    const ol = line.match(/^\s*\d+\.\s+(.*)$/)
    if (ol) {
      if (!list || !list.ordered) { flushList(); list = { ordered: true, items: [] } }
      list.items.push(ol[1])
      continue
    }

    const ul = line.match(/^\s*[-*]\s+(.*)$/)
    if (ul) {
      if (!list || list.ordered) { flushList(); list = { ordered: false, items: [] } }
      list.items.push(ul[1])
      continue
    }

    flushList()
    blocks.push(<p key={`b-${blocks.length}`} className="text-gray-700 leading-relaxed my-3">{renderInline(line, `p-${blocks.length}`)}</p>)
  }
  flushList()

  return <div className="text-[15px]">{blocks}</div>
}
