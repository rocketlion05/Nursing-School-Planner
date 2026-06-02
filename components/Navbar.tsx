'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { href: '/programs', label: 'Programs' },
  { href: '/plan', label: 'My Plan' },
  { href: '/profile', label: 'My Profile' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-teal-700">
          <Compass className="w-5 h-5" />
          <span>Pre-Nursing Compass</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
