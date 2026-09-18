

import { Link } from 'react-router-dom'
import { House, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp'

const cols = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Categories', to: '/categories' },
      { label: 'Featured', to: '/products?featured=true' },
    ],
  },
  {
    title: 'Store',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export function Footer() {
  const { settings } = useStoreSettings()
  const social = settings.social_links || {}
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
              <House className="h-4.5 w-4.5" />
            </span>
            {settings.store_name}
          </div>
          <p className="max-w-xs text-sm text-muted-fg">{settings.description}</p>
          <div className="mt-4 flex items-center gap-2">
            <a href={social.instagram || '#'} aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted focus-ring">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a href={social.facebook || '#'} aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted focus-ring">
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a href={getWhatsAppGeneralUrl()} aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted focus-ring">
              <MessageCircle className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-fg hover:text-ink focus-ring rounded">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Get in touch</h3>
          <ul className="space-y-2 text-sm text-muted-fg">
            <li>{settings.address}</li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-ink focus-ring rounded">{settings.email}</a>
            </li>
            <li>
              <a href={getWhatsAppGeneralUrl()} className="hover:text-ink focus-ring rounded">WhatsApp us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-fg sm:flex-row">
          <p>&copy; {year} BuildNest. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-ink focus-ring rounded">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink focus-ring rounded">Terms</Link>
            <span>Designed &amp; developed by Rafeh Malik</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
