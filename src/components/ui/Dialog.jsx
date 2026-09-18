import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Dialog({ open, onClose, title, children, className }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
     if (panelRef.current) {
    panelRef.current.focus()
  }
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/50 animate-in" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn('relative z-10 w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-pop focus-ring', className)}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-md p-1 text-muted-fg hover:bg-muted hover:text-ink focus-ring">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
