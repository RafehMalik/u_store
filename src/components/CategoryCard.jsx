import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

export function CategoryCard({ category, className }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className={cn('group relative block aspect-[4/3] overflow-hidden rounded-lg focus-ring', className)}
    >
      <img
        src={category.image_url}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-lg font-semibold text-white">{category.name}</h3>
        {typeof category.product_count === 'number' && (
          <p className="text-sm text-white/80">{category.product_count} products</p>
        )}
      </div>
    </Link>
  )
}
