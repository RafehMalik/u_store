// Realistic sample data so the storefront looks complete before Supabase
// is connected. Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set,
// the hooks in src/hooks read from the database instead.
import { slugify } from './utils'

export const sampleCategories = [
  {
    id: 'c1',
    name: 'Lighting',
    slug: 'lighting',
    description: 'Warm, sculptural lighting for every room.',
    image_url: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&q=80',
  },
  {
    id: 'c2',
    name: 'Seating',
    slug: 'seating',
    description: 'Chairs and stools built to be lived in.',
    image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
  },
  {
    id: 'c3',
    name: 'Tableware',
    slug: 'tableware',
    description: 'Everyday ceramics and glassware.',
    image_url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80',
  },
  {
    id: 'c4',
    name: 'Textiles',
    slug: 'textiles',
    description: 'Throws, cushions and rugs in natural fibres.',
    image_url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
  },
  {
    id: 'c5',
    name: 'Storage',
    slug: 'storage',
    description: 'Baskets, shelving and everyday organisation.',
    image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
  },
]

const raw = [
  { name: 'Amber Glow Table Lamp', category: 'Lighting', price: 8500, desc: 'A hand-blown amber glass shade over a solid oak base, casting a warm, diffused light for reading corners and bedside tables.', featured: true, colors: ['Amber', 'Smoke'], sizes: null,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&q=80','https://images.unsplash.com/photo-1543198126-cb0e522f4ba4?w=1000&q=80'] },
  { name: 'Arc Floor Lamp', category: 'Lighting', price: 24500, desc: 'A sweeping brass arc lamp that arches gracefully over a sofa or reading chair, finished in a brushed antique brass.', featured: true, colors: ['Brass'], sizes: null,
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1000&q=80'] },
  { name: 'Woven Rattan Pendant', category: 'Lighting', price: 6200, desc: 'Hand-woven natural rattan pendant shade that filters light into soft, dappled patterns overhead.', featured: false, colors: null, sizes: null,
    images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1000&q=80'] },
  { name: 'Boucle Lounge Chair', category: 'Seating', price: 42500, desc: 'A deep, cocooning lounge chair upholstered in cream boucle with solid beech legs — built for long afternoons.', featured: true, colors: ['Cream', 'Sand', 'Charcoal'], sizes: null,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1000&q=80','https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1000&q=80'] },
  { name: 'Walnut Counter Stool', category: 'Seating', price: 15800, desc: 'A minimal counter stool in solid walnut with a gently sculpted seat and brass foot rail.', featured: false, colors: ['Walnut'], sizes: ['Counter', 'Bar'],
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&q=80'] },
  { name: 'Curve Accent Chair', category: 'Seating', price: 38900, desc: 'Sculptural bouclé accent chair with a gentle curved back, a statement piece for any living room.', featured: true, colors: ['Oat', 'Terracotta'], sizes: null,
    images: ['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1000&q=80'] },
  { name: 'Stoneware Dinner Set (16pc)', category: 'Tableware', price: 12900, desc: 'A 16-piece hand-glazed stoneware dinner set in a soft speckled finish — dinner plates, side plates, bowls and mugs.', featured: true, colors: ['Oatmeal', 'Slate'], sizes: null,
    images: ['https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=1000&q=80','https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=1000&q=80'] },
  { name: 'Hand-blown Water Carafe', category: 'Tableware', price: 4200, desc: 'A slightly imperfect, hand-blown glass carafe with a matching tumbler, each piece unique.', featured: false, colors: ['Clear', 'Smoke'], sizes: null,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000&q=80'] },
  { name: 'Olive Wood Serving Board', category: 'Tableware', price: 5600, desc: 'A generous serving board cut from a single piece of olive wood, with natural grain variation.', featured: false, colors: null, sizes: ['Medium', 'Large'],
    images: ['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1000&q=80'] },
  { name: 'Linen Throw Blanket', category: 'Textiles', price: 6900, desc: 'A breathable, stonewashed linen throw that softens with every wash — perfect for the end of a sofa or bed.', featured: true, colors: ['Natural', 'Clay', 'Sage'], sizes: null,
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=1000&q=80'] },
  { name: 'Tufted Wool Cushion', category: 'Textiles', price: 3400, desc: 'A hand-tufted wool cushion cover with a subtle geometric motif, backed in natural cotton.', featured: false, colors: ['Rust', 'Cream', 'Forest'], sizes: ['40x40cm', '50x50cm'],
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1000&q=80'] },
  { name: 'Handwoven Jute Rug', category: 'Textiles', price: 18500, desc: 'A durable, handwoven jute rug with a subtle herringbone texture — ideal for entryways and living spaces.', featured: true, colors: ['Natural'], sizes: ['5x7ft', '6x9ft', '8x10ft'],
    images: ['https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1000&q=80'] },
  { name: 'Seagrass Storage Basket', category: 'Storage', price: 3100, desc: 'A hand-woven seagrass basket with sturdy handles, useful for blankets, toys or laundry.', featured: false, colors: ['Natural'], sizes: ['Small', 'Medium', 'Large'],
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1000&q=80'] },
  { name: 'Oak Ladder Shelf', category: 'Storage', price: 21900, desc: 'A five-tier leaning ladder shelf in solid oak, freestanding against any wall with no drilling required.', featured: true, colors: ['Natural Oak'], sizes: null,
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1000&q=80','https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1000&q=80'] },
  { name: 'Woven Storage Trunk', category: 'Storage', price: 8800, desc: 'A lidded woven trunk that doubles as a side table, roomy enough for spare cushions and throws.', featured: false, colors: ['Natural', 'Charcoal'], sizes: null,
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&q=80'] },
]

export const sampleProducts = raw.map((p, i) => {
  const category = sampleCategories.find((c) => c.name === p.category)
  return {
    id: `p${i + 1}`,
    name: p.name,
    slug: slugify(p.name),
    description: p.desc,
    price: p.price,
    category_id: category?.id,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    is_featured: p.featured,
    is_available: true,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
  }
})

export const sampleStoreSettings = {
  store_name: 'Aurelia House',
  description: 'Curated home & lifestyle goods, made to last and easy to order — just message us on WhatsApp.',
  whatsapp_number: '923001234567',
  email: 'hello@aureliahouse.pk',
  address: 'Blue Area, Islamabad, Pakistan',
  logo_url: null,
  social_links: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
}
