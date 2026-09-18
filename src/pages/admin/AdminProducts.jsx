import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { useAdminProducts } from '../../hooks/useAdminData'
import { buttonVariants, Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Dialog } from '../../components/ui/Dialog'
import { EmptyState, ErrorState } from '../../components/States'
import { useToast } from '../../components/ui/Toast'
import { formatPrice, cn } from '../../lib/utils'

export default function AdminProducts() {
  const { products, loading, error, reload, updateProduct, deleteProduct } = useAdminProducts()
  const [pendingDelete, setPendingDelete] = useState(null)
  const { push } = useToast()

  async function confirmDelete() {
    const { error: delError } = await deleteProduct(pendingDelete.id)
    setPendingDelete(null)
    push(delError || `${pendingDelete.name} was deleted.`, delError ? 'error' : 'success')
  }

  async function toggleField(product, field) {
    const { error: updError } = await updateProduct(product.id, { [field]: !product[field] })
    if (updError) push(updError, 'error')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-fg">{loading ? 'Loading…' : `${products.length} products`}</p>
        </div>
        <Link to="/admin/products/new" className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-fg">Loading products…</p>}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="No products yet"
          description="Add your first product to start building your catalog."
          action={<Link to="/admin/products/new" className={cn(buttonVariants(), 'mt-4')}>Add product</Link>}
        />
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* Table on larger screens */}
          <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-muted-fg">
                <tr>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Price</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Featured</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded-md object-cover bg-muted" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-fg">{p.category?.name || '—'}</td>
                    <td className="p-3">{formatPrice(p.price)}</td>
                    <td className="p-3">
                      <button onClick={() => toggleField(p, 'is_available')} className="focus-ring rounded">
                        <Badge variant={p.is_available ? 'success' : 'destructive'}>
                          {p.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </button>
                    </td>
                    <td className="p-3">
                      <button onClick={() => toggleField(p, 'is_featured')} aria-label="Toggle featured" className="focus-ring rounded">
                        <Star className={cn('h-5 w-5', p.is_featured ? 'fill-accent text-accent' : 'text-muted-fg')} />
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="rounded-md p-2 hover:bg-muted focus-ring">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => setPendingDelete(p)} aria-label={`Delete ${p.name}`} className="rounded-md p-2 text-destructive hover:bg-destructive/10 focus-ring">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on mobile */}
          <div className="grid gap-3 lg:hidden">
            {products.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex gap-3">
                  <img src={p.images?.[0]} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover bg-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-sm text-muted-fg">{p.category?.name || '—'} &middot; {formatPrice(p.price)}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant={p.is_available ? 'success' : 'destructive'}>{p.is_available ? 'Available' : 'Unavailable'}</Badge>
                      {p.is_featured && <Badge variant="accent">Featured</Badge>}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link to={`/admin/products/${p.id}/edit`} className={buttonVariants({ variant: 'outline', size: 'sm', className: 'flex-1' })}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => setPendingDelete(p)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete product?">
        <p className="text-sm text-muted-fg">
          This will permanently remove <strong className="text-ink">{pendingDelete?.name}</strong> from your catalog. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDelete}>Delete product</Button>
        </div>
      </Dialog>
    </div>
  )
}
