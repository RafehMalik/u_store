import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react'
import { useProduct, useProducts } from '../hooks/useProducts'
import { WhatsAppOrderButton } from '../components/WhatsAppOrderButton'
import { ProductCard } from '../components/ProductCard'
import { Badge } from '../components/ui/Badge'
import { formatPrice, cn } from '../lib/utils'
import { ErrorState } from '../components/States'

export default function ProductDetail() {
  const { slug } = useParams()
  const { product, loading, error } = useProduct(slug)
  const [activeImage, setActiveImage] = useState(0)
  const { products: related } = useProducts({ categorySlug: product?.category?.slug })

  if (loading) {
    return (
      <div className="container py-10">
        <div className="grid animate-pulse gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-lg bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-6 w-1/3 rounded bg-muted" />
            <div className="h-24 w-full rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="container py-10"><ErrorState message={error} /></div>
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-muted-fg">This item may have been removed or renamed.</p>
        <Link to="/products" className="mt-6 inline-block text-primary hover:underline">Back to all products</Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : []
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div className="container py-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-fg hover:text-ink focus-ring rounded">
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            {images[activeImage] && (
              <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === activeImage}
                  className={cn(
                    'h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 focus-ring',
                    i === activeImage ? 'border-primary' : 'border-transparent'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category?.name && (
            <Link to={`/products?category=${product.category.slug}`} className="text-sm font-medium text-primary hover:underline">
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1 font-display text-3xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-ink">{formatPrice(product.price)}</p>

          <div className="mt-3 flex items-center gap-2">
            {product.is_available ? (
              <Badge variant="success"><CheckCircle2 className="mr-1 h-3 w-3" /> In stock</Badge>
            ) : (
              <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Sold out</Badge>
            )}
            {product.is_featured && <Badge variant="accent">Featured</Badge>}
          </div>

          <p className="mt-5 leading-relaxed text-muted-fg">{product.description}</p>

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <h2 className="mb-2 text-sm font-semibold">Available colors</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => <Badge key={c}>{c}</Badge>)}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-2 text-sm font-semibold">Available sizes</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
          )}

          <div className="mt-8">
            <WhatsAppOrderButton product={product} className="w-full sm:w-auto" />
            <p className="mt-2 text-xs text-muted-fg">Opens WhatsApp with your order details pre-filled — mention colour/size if applicable.</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-xl font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
