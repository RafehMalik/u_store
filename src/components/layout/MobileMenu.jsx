import { NavLink } from 'react-router-dom'
import { Sheet } from '../ui/Sheet'
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp'
import { MessageCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

export function MobileMenu({ open, onClose, items }) {
  return (
    <Sheet open={open} onClose={onClose} title="Menu" side="left">
      <nav className="flex flex-col gap-1" aria-label="Mobile">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn('rounded-md px-3 py-3 text-base font-medium hover:bg-muted focus-ring', isActive && 'bg-muted')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <a
        href={getWhatsAppGeneralUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-whatsapp py-3 font-medium text-white"
      >
        <MessageCircle className="h-5 w-5" /> Chat with us
      </a>
    </Sheet>
  )
}
