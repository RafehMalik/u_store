import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, Settings, Menu, LogOut, House } from 'lucide-react'
import { Sheet } from '../components/ui/Sheet'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/utils'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {navItems.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-muted hover:text-ink focus-ring',
              isActive && 'bg-primary/10 text-primary'
            )
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { signOut, user, isConfigured } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surface p-4 lg:block">
          <div className="mb-6 flex items-center gap-2 px-1 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
              <House className="h-4.5 w-4.5" />
            </span>
            Admin
          </div>
          <NavItems />
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open admin menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted focus-ring lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden text-sm text-muted-fg lg:block">
              {isConfigured ? (user?.email || 'Signed in') : 'Preview mode — connect Supabase to enable login'}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted focus-ring"
              >
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <Sheet open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Admin menu" side="left">
        <NavItems onNavigate={() => setDrawerOpen(false)} />
      </Sheet>
    </div>
  )
}
