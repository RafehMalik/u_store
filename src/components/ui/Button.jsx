import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-primary text-primary-fg hover:opacity-90',
  secondary: 'bg-secondary text-secondary-fg hover:bg-muted border border-border',
  outline: 'border border-border bg-transparent text-ink hover:bg-muted',
  ghost: 'bg-transparent text-ink hover:bg-muted',
  destructive: 'bg-destructive text-destructive-fg hover:opacity-90',
  whatsapp: 'bg-whatsapp text-white hover:brightness-95',
  accent: 'bg-accent text-accent-fg hover:opacity-90',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
}

export function buttonVariants({ variant = 'primary', size = 'md', className } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  )
}

export const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', ...props },
  ref
) {
  return <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />
})
