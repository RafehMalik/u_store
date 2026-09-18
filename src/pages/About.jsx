import { ShieldCheck, Leaf, Handshake } from 'lucide-react'

const values = [
  { icon: Leaf, title: 'Simple Shopping', desc: 'Browse our catalog, find a product you like, and get in touch with us directly to place your order.' },
  { icon: ShieldCheck, title: 'A Variety You Can Trust', desc: 'We bring multiple everyday product categories together so you can find more of what you need in one place.' },
  { icon: Handshake, title: 'Convenient Ordering', desc: 'No complicated checkout process. Simply choose your product and contact us through WhatsApp to confirm your order.' },
]

export default function About() {
  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="container py-14">
          <h1 className="max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Everything You Need, All in One Place.
          </h1>
          <p className="mt-4 max-w-lg text-muted-fg">
            We created A-Store to make mobile shopping simple and convenient. From smartphones and phone cases to chargers, cables, earbuds, smartwatches, and other useful gadgets, we bring everyday tech essentials together in one place. Whether you're upgrading your phone, looking for the right accessory, or searching for a useful gadget, our goal is to help you find what you need quickly and easily.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-lg border border-border bg-surface p-6">
              <v.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="font-display font-semibold">{v.title}</h2>
              <p className="mt-1 text-sm text-muted-fg">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="container grid items-center gap-8 lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
            alt="A small workshop table with craft tools and materials"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="font-display text-2xl font-semibold">How ordering works</h2>
            <ol className="mt-4 space-y-3 text-muted-fg">
              <li><strong className="text-ink">1. Browse the catalog</strong> — filter by category or search for something specific.</li>
              <li><strong className="text-ink">2. Tap "Order on WhatsApp"</strong> — we pre-fill the product, price and ID for you.</li>
              <li><strong className="text-ink">3. Confirm details with us</strong> — colour, size and delivery, all in one chat.</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  )
}
