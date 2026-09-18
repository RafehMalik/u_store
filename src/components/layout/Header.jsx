import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Search, Menu, House } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { cn } from '../../lib/utils'
import { useStoreSettings } from '../../hooks/useStoreSettings'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin', to: '/admin' },
]

export function Header() {
  const { settings } = useStoreSettings()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function submitSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold focus-ring rounded" aria-label="Aurelia House home">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
            <House className="h-4.5 w-4.5" />
          </span>
          {settings.store_name}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-ink/80 hover:text-ink hover:bg-muted focus-ring',
                  isActive && 'text-ink bg-muted'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="h-10 w-56 rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted focus-ring"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <ThemeToggle />

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted focus-ring lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={navItems} />
    </header>
  )
}
