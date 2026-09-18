import { PackageSearch, AlertTriangle } from 'lucide-react'
import { Button } from './ui/Button'

export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-border bg-surface">
      <div className="aspect-[4/5] bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/4 rounded bg-muted" />
        <div className="mt-2 h-9 rounded bg-muted" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <PackageSearch className="mb-3 h-10 w-10 text-muted-fg" aria-hidden="true" />
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-fg">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center" role="alert">
      <AlertTriangle className="mb-3 h-10 w-10 text-destructive" aria-hidden="true" />
      <h3 className="font-display text-lg font-semibold">{message}</h3>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
