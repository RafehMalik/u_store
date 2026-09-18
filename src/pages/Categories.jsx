import { useCategories } from '../hooks/useCategories'
import { CategoryCard } from '../components/CategoryCard'
import { EmptyState, ErrorState } from '../components/States'

export default function Categories() {
  const { categories, loading, error, reload } = useCategories()

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-semibold">Shop by category</h1>
      <p className="mt-2 max-w-lg text-muted-fg">Every product in our catalog, grouped so you can browse exactly what you're looking for.</p>

      <div className="mt-8">
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && categories.length === 0 && <EmptyState title="No categories yet" />}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        )}
      </div>
    </div>
  )
}
