# Aurelia House — WhatsApp Product Catalog

A responsive product catalog / storefront where customers browse products
and place orders through WhatsApp — no cart, no checkout, no online payment.
Built with React, Vite, JavaScript, Tailwind CSS, React Router and Supabase.

The app works immediately with realistic sample data even before Supabase is
connected, so you can review the full design first, then wire up your real
database when you're ready.

---

## 1. Architecture

```
Customer → React + Vite Storefront → Supabase (Postgres + Storage + Auth) → Vercel
Admin    → Admin login → React Admin Dashboard → Supabase
Ordering → Product → "Order on WhatsApp" → wa.me link → Customer's WhatsApp
```

There is no separate backend server — the React app talks to Supabase
directly using the Supabase JS client (`@supabase/supabase-js`), and to
WhatsApp using a plain `https://wa.me/...` link. No Node/Express API layer.

## 2. Project structure

```
src/
  components/       Reusable UI (ProductCard, CategoryCard, states, layout, ui/*)
  contexts/         ThemeContext (light/dark), AuthContext (Supabase auth)
  hooks/            useProducts, useCategories, useAdminData (CRUD)
  layouts/          StorefrontLayout, AdminLayout
  lib/              supabase client, sampleData, whatsapp helper, utils
  pages/            Home, Products, ProductDetail, Categories, About, Contact…
  pages/admin/      AdminLogin, AdminDashboard, AdminProducts, AdminProductForm,
                    AdminCategories, AdminSettings
supabase/
  schema.sql        Tables, RLS policies, storage buckets — run once in Supabase
```

## 3. Getting started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project details
npm run dev
```

The site runs fully on sample data if you skip the `.env` step — useful for
reviewing the design before your Supabase project exists.

```bash
npm run build           # production build to dist/
npm run preview         # preview the production build locally
```

## 4. Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates the `products`,
   `categories`, `store_settings` and `profiles` tables, enables Row Level
   Security, and creates the `product-images`, `category-images` and
   `store-assets` storage buckets.
3. Go to **Project Settings → API** and copy your **Project URL** and
   **anon public key** into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxx
   VITE_WHATSAPP_NUMBER=923001234567
   ```
   Never put your **service_role** key in the frontend — only the anon key
   belongs in a React app.
4. Create your admin user under **Authentication → Users → Add user**
   (email + password).
5. In **Table editor → profiles**, insert a row with that user's `id`
   (copied from the Users list) and `role = 'admin'`. This is what grants
   write access — see the RLS policy notes below.
6. Add your real products and categories via the admin dashboard at
   `/admin`, or insert them directly in the Table editor.

### Row Level Security, explained

- **Public (anon) users** can read all categories, all store settings, and
  only products where `is_available = true`. They cannot insert, update or
  delete anything.
- **Admins** (rows in `profiles` with `role` of `admin` or `staff`) can read
  and write everything, via a `is_admin()` SQL function checked in every
  policy.
- Storage buckets follow the same pattern: public read, admin-only write.
- Nobody can insert into `profiles` from the frontend — admins are
  provisioned manually from the Supabase dashboard, so a signed-up user can
  never grant themselves admin rights.

## 5. WhatsApp ordering

`src/lib/whatsapp.js` builds a `https://wa.me/<number>?text=<message>` link
for every product, with the number read from `VITE_WHATSAPP_NUMBER` (or from
the Settings page once Supabase is connected). The message includes the
product name, ID and price, safely encoded with `encodeURIComponent`. This
link works on mobile (opens the WhatsApp app), WhatsApp Web, and desktop.

## 6. Design system

- **Color tokens** are defined as CSS variables in `src/index.css` (light and
  dark values) and exposed as Tailwind colors in `tailwind.config.js` —
  `bg`, `surface`, `ink`, `muted`, `border`, `primary`, `secondary`, `accent`,
  `destructive`, `success`. The WhatsApp button uses its own recognizable
  green (`whatsapp`) without letting it dominate the rest of the UI.
- **Typography**: Sora for display/headings, Inter for body text.
- **Theme toggle** persists to `localStorage` and respects
  `prefers-color-scheme` on first visit.
- **Accessibility**: semantic HTML, labelled form fields, visible focus
  rings, keyboard-operable menus/dialogs/drawers, alt text on all product
  images, `prefers-reduced-motion` respected.

## 7. Deploying to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, **Add New → Project**, import the repo (framework preset:
   Vite is auto-detected).
3. Add the same three environment variables from your `.env` file under
   **Project Settings → Environment Variables**.
4. Deploy. Vercel runs `npm run build` and serves `dist/`.
5. Add your custom domain under **Project Settings → Domains** and follow
   the DNS instructions shown there.

## 8. Production checklist

- [ ] `supabase/schema.sql` run against your project
- [ ] Real environment variables set in Vercel (not just `.env` locally)
- [ ] Admin user created + matching `profiles` row with `role = 'admin'`
- [ ] Real products/categories added, sample data replaced
- [ ] WhatsApp number confirmed correct in Settings
- [ ] `npm run build` completes with no errors
- [ ] Light and dark mode both checked on mobile and desktop
- [ ] Custom domain connected and HTTPS active

---

Designed & developed by **Rafeh Malik**.
