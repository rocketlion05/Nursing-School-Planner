// Loads SEO guide articles from markdown files in content/guides/*.md.
// Each file has a simple frontmatter block followed by the markdown body:
//
//   ---
//   title: How to Get Into Nursing School in Texas
//   description: A step-by-step guide to BSN admissions in Texas.
//   date: 2026-06-23
//   ---
//   ## Body markdown here...
//
// The weekly SEO routine adds new .md files here; no DB/migration needed.
import { promises as fs } from 'node:fs'
import path from 'node:path'

export type Guide = {
  slug: string
  title: string
  description: string
  date: string
  body: string
}

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides')

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/^﻿/, '')
  if (!text.startsWith('---')) return { meta: {}, body: text }
  const end = text.indexOf('\n---', 3)
  if (end === -1) return { meta: {}, body: text }
  const fm = text.slice(3, end).trim()
  const body = text.slice(end + 4).replace(/^\s*\n/, '')
  const meta: Record<string, string> = {}
  for (const line of fm.split('\n')) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const k = line.slice(0, i).trim()
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    meta[k] = v
  }
  return { meta, body }
}

export async function getAllGuides(): Promise<Guide[]> {
  let files: string[]
  try {
    files = (await fs.readdir(GUIDES_DIR)).filter(f => f.endsWith('.md'))
  } catch {
    return []
  }
  const guides = await Promise.all(
    files.map(async f => {
      const raw = await fs.readFile(path.join(GUIDES_DIR, f), 'utf8')
      const { meta, body } = parseFrontmatter(raw)
      return {
        slug: f.replace(/\.md$/, ''),
        title: meta.title ?? f.replace(/\.md$/, ''),
        description: meta.description ?? '',
        date: meta.date ?? '',
        body,
      }
    }),
  )
  return guides.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const all = await getAllGuides()
  return all.find(g => g.slug === slug) ?? null
}
