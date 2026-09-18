import { Link } from 'react-router-dom'
import { MessageCircle, ShieldCheck, Zap, Truck, ArrowRight } from 'lucide-react'
import { buttonVariants } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { CategoryCard } from '../components/CategoryCard'
import { ProductGridSkeleton } from '../components/States'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'

const perks = [
  { icon: ShieldCheck, title: 'Quality, checked', desc: 'Every piece is inspected before it leaves our workshop.' },
  { icon: MessageCircle, title: 'Order in one message', desc: 'No forms, no accounts — just message us on WhatsApp.' },
  { icon: Zap, title: 'Fast replies', desc: 'We usually confirm availability within the hour.' },
  // { icon: Truck, title: 'Nationwide delivery', desc: 'We ship across Pakistan, cash on delivery available.' },
]

export default function Home() {
  const { products, loading } = useProducts({ onlyFeatured: true })
  const { categories } = useCategories()

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <h1 className="max-w-lg font-display text-4xl font-semibold leading-tight sm:text-5xl">
             Everything You Need, All in One Place.
            </h1>
            <p className="mt-4 max-w-md text-muted-fg">
              Phones, accessories, gadgets, and everyday essentials — all in one place. We make it easy to find the technology you need for work, entertainment, and everyday life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className={buttonVariants({ size: 'lg' })}>
                Shop products
              </Link>
              <Link to="/categories" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Explore categories
              </Link>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1628581885470-49a5d56a92af?w=800&q=80"
              alt="Black smartphone on a black surface"
              className="col-span-2 h-56 w-full rounded-lg object-cover sm:h-72"
            />
            <img
              src="https://images.unsplash.com/photo-1759588071847-6ba0f3dbd16e?w=600&q=80"
              alt="Close-up of a dark smartphone camera array"
              className="h-40 w-full rounded-lg object-cover sm:h-52"
            />
            <img
              src="https://images.unsplash.com/photo-1735582797327-1c1ec6335156?w=600&q=80"
              alt="Smartphone showing a search screen on a dark surface"
              className="h-40 w-full rounded-lg object-cover sm:h-52"
            />
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="container py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-fg">Find what you need faster.</p>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex focus-ring rounded">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-border bg-surface py-14">
        <div className="container">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Featured products</h2>
              <p className="mt-1 text-sm text-muted-fg">A few of our current favourites.</p>
            </div>
            <Link to="/products" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex focus-ring rounded">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container py-14">
        <h2 className="mb-8 font-display text-2xl font-semibold">Why shop with us</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-surface p-5">
              <p.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="font-display font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-fg">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary py-16 text-primary-fg">
        <div className="container flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Ready to find something you'll love?</h2>
          <p className="max-w-md text-primary-fg/80">Browse the full catalog or message us directly if you're looking for something specific.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className={buttonVariants({ size: 'lg', variant: 'accent' })}>
              Browse products
            </Link>
            <Link to="/contact" className={buttonVariants({ size: 'lg', variant: 'secondary' })}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
