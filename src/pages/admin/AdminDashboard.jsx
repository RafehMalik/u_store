import { Link } from 'react-router-dom'
import { Package, CheckCircle2, Star, FolderTree, Plus } from 'lucide-react'
import { useAdminProducts, useAdminCategories } from '../../hooks/useAdminData'
import { Card, CardContent } from '../../components/ui/Card'
import { buttonVariants } from '../../components/ui/Button'
import { formatPrice, cn } from '../../lib/utils'

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-muted-fg">{label}</p>
          <p className="font-display text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { products, loading: productsLoading } = useAdminProducts()
  const { categories } = useAdminCategories()

  const stats = {
    total: products.length,
    available: products.filter((p) => p.is_available).length,
    featured: products.filter((p) => p.is_featured).length,
    categories: categories.length,
  }
  const recent = [...products].slice(0, 5)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-fg">An overview of your catalog.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/products/new" className={buttonVariants({ size: 'sm' })}>
            <Plus className="h-4 w-4" /> Add product
          </Link>
          <Link to="/admin/categories" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Manage categories
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total products" value={productsLoading ? '—' : stats.total} />
        <StatCard icon={CheckCircle2} label="Available" value={productsLoading ? '—' : stats.available} />
        <StatCard icon={Star} label="Featured" value={productsLoading ? '—' : stats.featured} />
        <StatCard icon={FolderTree} label="Categories" value={stats.categories} />
      </div>

      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-display font-semibold">Recently added</h2>
            <Link to="/admin/products" className="text-sm font-medium text-primary hover:underline">Manage products</Link>
          </div>
          <div className="divide-y divide-border">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <img src={p.images?.[0]} alt="" className="h-12 w-12 rounded-md object-cover bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-sm text-muted-fg">{p.category?.name || 'Uncategorised'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(p.price)}</p>
                  <p className={cn('text-xs', p.is_available ? 'text-success' : 'text-destructive')}>
                    {p.is_available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
              </div>
            ))}
            {recent.length === 0 && <p className="p-5 text-sm text-muted-fg">No products yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
