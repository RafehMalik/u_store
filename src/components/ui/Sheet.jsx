import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

// Slide-in panel used for mobile filters, the mobile nav menu, and the
// admin sidebar drawer. Rendered via a portal directly into document.body
// so it always covers the full viewport as a true overlay — nesting it
// inside the sticky header (or any other positioned ancestor) can trap it
// inside that ancestor's stacking context in some browsers, leaving header
// controls visibly floating on top of it instead of being covered/dimmed.
export function Sheet({ open, onClose, title, side = 'right', children, className }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      // Lock background scroll while the drawer is open.
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = previousOverflow
      }
    }
  }, [open, onClose])

  if (!open) return null

  const sideClasses = side === 'left' ? 'left-0' : side === 'bottom' ? 'left-0 right-0 bottom-0 top-auto' : 'right-0'

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn(
          'absolute top-0 h-full w-full max-w-sm bg-surface p-5 shadow-pop overflow-y-auto',
          side === 'bottom' && 'h-auto max-h-[85vh] max-w-full rounded-t-xl',
          sideClasses,
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted-fg hover:bg-muted hover:text-ink focus-ring">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}