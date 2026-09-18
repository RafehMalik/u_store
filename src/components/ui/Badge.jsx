import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-secondary text-secondary-fg border border-border',
  accent: 'bg-accent/15 text-accent border border-accent/30',
  success: 'bg-success/15 text-success border border-success/30',
  destructive: 'bg-destructive/15 text-destructive border border-destructive/30',
}

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
