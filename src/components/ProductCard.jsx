import { Link } from 'react-router-dom'
import { Badge } from './ui/Badge'
import { formatPrice, cn } from '../lib/utils'
import { useCart } from '../contexts/CartContext'
import { Button } from './ui/Button'

export function ProductCard({ product, className }) {
  const { addToCart } = useCart()
  const image = product.images?.[0]

  return (
    <div className={cn('group flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-pop', className)}>
      <Link to={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-muted focus-ring">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-fg">No image</div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_featured && <Badge variant="accent">Featured</Badge>}
          {!product.is_available && <Badge variant="destructive">Sold out</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {product.category?.name && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-fg">{product.category.name}</span>
        )}
        <Link to={`/products/${product.slug}`} className="font-display font-semibold leading-snug text-ink hover:underline focus-ring rounded">
          {product.name}
        </Link>
        <p className="mt-0.5 font-medium text-ink">{formatPrice(product.price)}</p>

        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium text-ink hover:bg-muted focus-ring"
          >
            View details
          </Link>
          <Button type="button" size="sm" className="flex-1" disabled={!product.is_available} onClick={() => addToCart(product)}>
            Add to cart
          </Button>
          {/* WhatsApp order button disabled while cart ordering is used. */}
        </div>
      </div>
    </div>
  )
}
