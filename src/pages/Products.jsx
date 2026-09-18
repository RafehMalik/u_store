import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { ProductCard } from '../components/ProductCard'
import { ProductGridSkeleton, EmptyState, ErrorState } from '../components/States'
import { Input, Select, Label } from '../components/ui/Input'
import { Sheet } from '../components/ui/Sheet'
import { Button } from '../components/ui/Button'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(params.get('q') || '')

  const categorySlug = params.get('category') || ''
  const search = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  const onlyFeatured = params.get('featured') === 'true'

  const { categories } = useCategories()
  const { products, loading, error, reload } = useProducts({ categorySlug, search, sort, onlyFeatured })

  useEffect(() => { setSearchInput(search) }, [search])

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  function submitSearch(e) {
    e.preventDefault()
    updateParam('q', searchInput.trim())
  }

  const filtersUI = (
    <div className="space-y-5">
      <div>
        <Label htmlFor="category-filter">Category</Label>
        <Select id="category-filter" value={categorySlug} onChange={(e) => updateParam('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="sort-filter">Sort by</Label>
        <Select id="sort-filter" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
          {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={onlyFeatured}
          onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
          className="h-4 w-4 rounded border-border text-primary focus-ring"
        />
        Featured only
      </label>
      {(categorySlug || onlyFeatured || search) && (
        <Button variant="ghost" size="sm" onClick={() => setParams({})}>Clear filters</Button>
      )}
    </div>
  )

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">All products</h1>
          <p className="mt-1 text-sm text-muted-fg">
            {loading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <div className="flex gap-2">
          <form onSubmit={submitSearch} className="flex-1 sm:w-64">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
            />
          </form>
          <Button variant="outline" className="lg:hidden" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <h2 className="mb-4 font-display font-semibold">Filters</h2>
          {filtersUI}
        </aside>

        <div>
          {loading && <ProductGridSkeleton />}
          {!loading && error && <ErrorState message={error} onRetry={reload} />}
          {!loading && !error && products.length === 0 && (
            <EmptyState
              title="No products match your filters"
              description="Try a different search term or clear your filters."
              action={<Button variant="outline" className="mt-4" onClick={() => setParams({})}>Clear filters</Button>}
            />
          )}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters" side="bottom">
        {filtersUI}
        <Button className="mt-6 w-full" onClick={() => setFilterOpen(false)}>Show results</Button>
      </Sheet>
    </div>
  )
}
