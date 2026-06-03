'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { logout } from '@/app/actions/auth'

const PUBLIC_LINKS = [
  { href: '/programs', label: 'Programs' },
  { href: '/pricing', label: 'Pricing' },
]
const AUTH_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/programs', label: 'Programs' },
  { href: '/plan', label: 'My Plan' },
  { href: '/profile', label: 'My Profile' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar({ username }: { username: string | null }) {
  const pathname = usePathname()
  const links = username ? AUTH_LINKS : PUBLIC_LINKS

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-teal-700">
          <Compass className="w-5 h-5" />
          <span>Nursing School Planner</span>
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

          <div className="w-px h-5 bg-gray-200 mx-1.5" />

          {username ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500 px-1.5 hidden sm:inline">
                {username}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-md text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
