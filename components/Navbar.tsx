'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, LogOut, User, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { logout } from '@/app/actions/auth'

const PLANNER_LINKS = [
  { href: '/programs', label: 'Programs' },
  { href: '/deadlines', label: 'Deadlines' },
  { href: '/plan', label: 'My Plan' },
]

function navLinkCls(active: boolean) {
  return clsx(
    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
    active
      ? 'bg-teal-50 text-teal-700'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  )
}

export default function Navbar({ displayName, isAdmin = false }: { displayName: string | null; isAdmin?: boolean }) {
  const pathname = usePathname()
  const [plannerOpen, setPlannerOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const plannerRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function onMouse(e: MouseEvent) {
      if (plannerRef.current && !plannerRef.current.contains(e.target as Node)) setPlannerOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setPlannerOpen(false); setUserOpen(false) }
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onMouse); document.removeEventListener('keydown', onKey) }
  }, [])

  // Collapse all menus on route change (intentional reset-on-navigation).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- resetting menu state when the route changes is intended */
    setMobileOpen(false)
    setPlannerOpen(false)
    setUserOpen(false)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname])

  const plannerActive = PLANNER_LINKS.some(l => pathname.startsWith(l.href))

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-teal-700 shrink-0 whitespace-nowrap"
        >
          <Image src="/logo-mark.png" alt="Nursing School Planner" width={32} height={32} priority className="w-8 h-8" />
          <span className="hidden lg:inline">Nursing School Planner</span>
        </Link>

        {/* ── Desktop centre nav ── */}
        <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main navigation">
          {displayName ? (
            <>
              <Link href="/dashboard" className={navLinkCls(pathname.startsWith('/dashboard'))}>
                Dashboard
              </Link>

              {/* Planner dropdown */}
              <div className="relative" ref={plannerRef}>
                <button
                  onClick={() => setPlannerOpen(o => !o)}
                  aria-haspopup="true"
                  aria-expanded={plannerOpen}
                  aria-label="Planner menu"
                  className={clsx(navLinkCls(plannerActive), 'flex items-center gap-1')}
                >
                  Planner
                  <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-150', plannerOpen && 'rotate-180')} />
                </button>
                {plannerOpen && (
                  <div
                    role="menu"
                    className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20"
                  >
                    {PLANNER_LINKS.map(l => (
                      <Link
                        key={l.href}
                        href={l.href}
                        role="menuitem"
                        className={clsx(
                          'block px-3 py-2 text-sm transition-colors',
                          pathname.startsWith(l.href)
                            ? 'text-teal-700 bg-teal-50 font-medium'
                            : 'text-gray-700 hover:bg-gray-50',
                        )}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/study-tools" className={navLinkCls(pathname.startsWith('/study-tools'))}>
                Study Tools
              </Link>
              <Link href="/guides" className={navLinkCls(pathname.startsWith('/guides'))}>
                Guides
              </Link>
              <Link href="/pricing" className={navLinkCls(pathname.startsWith('/pricing'))}>
                Pricing
              </Link>
            </>
          ) : (
            <>
              <Link href="/programs" className={navLinkCls(pathname.startsWith('/programs'))}>Programs</Link>
              <Link href="/chance-calculator" className={navLinkCls(pathname.startsWith('/chance-calculator'))}>Chances</Link>
              <Link href="/study-tools" className={navLinkCls(pathname.startsWith('/study-tools'))}>Study Tools</Link>
              <Link href="/guides" className={navLinkCls(pathname.startsWith('/guides'))}>Guides</Link>
              <Link href="/pricing" className={navLinkCls(pathname.startsWith('/pricing'))}>Pricing</Link>
            </>
          )}
        </nav>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Desktop right side ── */}
        <div className="hidden md:flex items-center gap-2">
          {displayName ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={userOpen}
                aria-label="User menu"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors max-w-[160px]"
              >
                <span className="truncate">{displayName}</span>
                <ChevronDown className={clsx('w-3.5 h-3.5 shrink-0 transition-transform duration-150', userOpen && 'rotate-180')} />
              </button>
              {userOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/requests"
                      role="menuitem"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      Admin
                    </Link>
                  )}
                  <div className="h-px bg-gray-100 mx-2 my-1" />
                  <form action={logout}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="px-3 py-1.5 rounded-md text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white px-3 py-3 space-y-0.5">
          {displayName ? (
            <>
              <Link href="/dashboard" className={clsx('block', navLinkCls(pathname.startsWith('/dashboard')))}>
                Dashboard
              </Link>

              {/* Planner group */}
              <div className="pl-1">
                <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Planner</p>
                {PLANNER_LINKS.map(l => (
                  <Link key={l.href} href={l.href} className={clsx('block', navLinkCls(pathname.startsWith(l.href)))}>
                    {l.label}
                  </Link>
                ))}
              </div>

              <Link href="/study-tools" className={clsx('block', navLinkCls(pathname.startsWith('/study-tools')))}>
                Study Tools
              </Link>
              <Link href="/guides" className={clsx('block', navLinkCls(pathname.startsWith('/guides')))}>
                Guides
              </Link>
              <Link href="/pricing" className={clsx('block', navLinkCls(pathname.startsWith('/pricing')))}>
                Pricing
              </Link>

              {/* User section */}
              <div className="border-t border-gray-100 pt-2 mt-2 space-y-0.5">
                <p className="px-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">{displayName}</p>
                <Link href="/profile" className={clsx('block', navLinkCls(pathname === '/profile'))}>
                  My Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin/requests" className={clsx('block', navLinkCls(pathname.startsWith('/admin')))}>
                    Admin
                  </Link>
                )}
                <form action={logout}>
                  <button
                    type="submit"
                    className={clsx('w-full text-left flex items-center gap-2', navLinkCls(false))}
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link href="/programs" className={clsx('block', navLinkCls(pathname.startsWith('/programs')))}>Programs</Link>
              <Link href="/chance-calculator" className={clsx('block', navLinkCls(pathname.startsWith('/chance-calculator')))}>Chances</Link>
              <Link href="/study-tools" className={clsx('block', navLinkCls(pathname.startsWith('/study-tools')))}>Study Tools</Link>
              <Link href="/guides" className={clsx('block', navLinkCls(pathname.startsWith('/guides')))}>Guides</Link>
              <Link href="/pricing" className={clsx('block', navLinkCls(pathname.startsWith('/pricing')))}>Pricing</Link>
              <div className="border-t border-gray-100 pt-2 mt-2 space-y-0.5">
                <Link href="/login" className={clsx('block', navLinkCls(false))}>Log in</Link>
                <Link href="/signup" className="block px-3 py-1.5 rounded-md text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
}
