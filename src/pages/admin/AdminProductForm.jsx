// import { useEffect, useState } from 'react'
// import { useNavigate, useParams, Link } from 'react-router-dom'
// import { ChevronLeft, Plus, X } from 'lucide-react'
// import { useAdminProducts, useAdminCategories } from '../../hooks/useAdminData'
// import { Input, Textarea, Label, Select } from '../../components/ui/Input'
// import { Button } from '../../components/ui/Button'
// import { useToast } from '../../components/ui/Toast'
// import { slugify } from '../../lib/utils'

// const emptyForm = {
//   name: '', slug: '', description: '', price: '', category_id: '',
//   images: [''], sizes: '', colors: '', is_featured: false, is_available: true,
// }

// export default function AdminProductForm() {
//   const { id } = useParams()
//   const isEdit = Boolean(id)
//   const navigate = useNavigate()
//   const { push } = useToast()
//   const { products, createProduct, updateProduct } = useAdminProducts()
//   const { categories } = useAdminCategories()

//   const [form, setForm] = useState(emptyForm)
//   const [errors, setErrors] = useState({})
//   const [saving, setSaving] = useState(false)

//   useEffect(() => {
//     if (isEdit && products.length) {
//       const p = products.find((x) => x.id === id)
//       if (p) {
//         setForm({
//           name: p.name || '',
//           slug: p.slug || '',
//           description: p.description || '',
//           price: p.price ?? '',
//           category_id: p.category_id || p.category?.id || '',
//           images: p.images?.length ? p.images : [''],
//           sizes: (p.sizes || []).join(', '),
//           colors: (p.colors || []).join(', '),
//           is_featured: !!p.is_featured,
//           is_available: p.is_available !== false,
//         })
//       }
//     }
//   }, [isEdit, id, products])

//   function setField(key, value) {
//     setForm((f) => ({ ...f, [key]: value }))
//   }

//   function setImage(i, value) {
//     setForm((f) => {
//       const images = [...f.images]
//       images[i] = value
//       return { ...f, images }
//     })
//   }
//   function addImageField() {
//     setForm((f) => ({ ...f, images: [...f.images, ''] }))
//   }
//   function removeImageField(i) {
//     setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
//   }

//   function validate() {
//     const e = {}
//     if (!form.name.trim()) e.name = 'Product name is required.'
//     if (!form.price || Number(form.price) <= 0) e.price = 'Enter a valid price.'
//     if (!form.category_id) e.category_id = 'Select a category.'
//     if (!form.images.some((img) => img.trim())) e.images = 'Add at least one image URL.'
//     setErrors(e)
//     return Object.keys(e).length === 0
//   }

//   async function handleSubmit(e) {
//     e.preventDefault()
//     if (!validate()) return
//     setSaving(true)

//     const category = categories.find((c) => c.id === form.category_id)
//     const payload = {
//       name: form.name.trim(),
//       slug: form.slug.trim() || slugify(form.name),
//       description: form.description.trim(),
//       price: Number(form.price),
//       category_id: form.category_id,
//       category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
//       images: form.images.map((i) => i.trim()).filter(Boolean),
//       sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
//       colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
//       is_featured: form.is_featured,
//       is_available: form.is_available,
//     }

//     const { error } = isEdit ? await updateProduct(id, payload) : await createProduct(payload)
//     setSaving(false)

//     if (error) {
//       push(error, 'error')
//       return
//     }
//     push(isEdit ? 'Product updated.' : 'Product created.')
//     navigate('/admin/products')
//   }

//   return (
//     <div className="max-w-2xl">
//       <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-fg hover:text-ink focus-ring rounded">
//         <ChevronLeft className="h-4 w-4" /> Back to products
//       </Link>
//       <h1 className="mb-6 font-display text-2xl font-semibold">{isEdit ? 'Edit product' : 'Add product'}</h1>

//       <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//         <div>
//           <Label htmlFor="name">Product name</Label>
//           <Input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)} aria-invalid={!!errors.name} />
//           {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
//         </div>

//         <div>
//           <Label htmlFor="slug">Slug (URL)</Label>
//           <Input id="slug" placeholder="auto-generated from name if left blank" value={form.slug} onChange={(e) => setField('slug', e.target.value)} />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="price">Price (PKR)</Label>
//             <Input id="price" type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} aria-invalid={!!errors.price} />
//             {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
//           </div>
//           <div>
//             <Label htmlFor="category">Category</Label>
//             <Select id="category" value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} aria-invalid={!!errors.category_id}>
//               <option value="">Select…</option>
//               {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </Select>
//             {errors.category_id && <p className="mt-1 text-sm text-destructive">{errors.category_id}</p>}
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="description">Description</Label>
//           <Textarea id="description" rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)} />
//         </div>

//         <div>
//           <Label>Images (URLs)</Label>
//           <div className="space-y-2">
//             {form.images.map((img, i) => (
//               <div key={i} className="flex gap-2">
//                 <Input value={img} onChange={(e) => setImage(i, e.target.value)} placeholder="https://…" />
//                 {form.images.length > 1 && (
//                   <button type="button" onClick={() => removeImageField(i)} aria-label="Remove image" className="rounded-lg border border-border px-3 hover:bg-muted focus-ring">
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//           {errors.images && <p className="mt-1 text-sm text-destructive">{errors.images}</p>}
//           <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={addImageField}>
//             <Plus className="h-4 w-4" /> Add another image
//           </Button>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="sizes">Sizes (comma separated)</Label>
//             <Input id="sizes" placeholder="Small, Medium, Large" value={form.sizes} onChange={(e) => setField('sizes', e.target.value)} />
//           </div>
//           <div>
//             <Label htmlFor="colors">Colors (comma separated)</Label>
//             <Input id="colors" placeholder="Natural, Charcoal" value={form.colors} onChange={(e) => setField('colors', e.target.value)} />
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-6">
//           <label className="flex items-center gap-2 text-sm font-medium">
//             <input type="checkbox" checked={form.is_featured} onChange={(e) => setField('is_featured', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus-ring" />
//             Featured product
//           </label>
//           <label className="flex items-center gap-2 text-sm font-medium">
//             <input type="checkbox" checked={form.is_available} onChange={(e) => setField('is_available', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus-ring" />
//             Available for order
//           </label>
//         </div>

//         <div className="flex gap-3 pt-2">
//           <Button type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}</Button>
//           <Link to="/admin/products" className="inline-flex items-center rounded-lg border border-border px-5 text-sm font-medium hover:bg-muted focus-ring">
//             Cancel
//           </Link>
//         </div>
//       </form>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAdminProducts, useAdminCategories } from '../../hooks/useAdminData'
import { Input, Textarea, Label, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ImageUploader } from '../../components/ui/ImageUploader'
import { useToast } from '../../components/ui/Toast'
import { slugify } from '../../lib/utils'

const emptyForm = {
  name: '', slug: '', description: '', price: '', category_id: '',
  images: [''], sizes: '', colors: '', is_featured: false, is_available: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { push } = useToast()
  const { products, createProduct, updateProduct } = useAdminProducts()
  const { categories } = useAdminCategories()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit && products.length) {
      const p = products.find((x) => x.id === id)
      if (p) {
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          price: p.price ?? '',
          category_id: p.category_id || p.category?.id || '',
          images: p.images?.length ? [...p.images, ''] : [''],
          sizes: (p.sizes || []).join(', '),
          colors: (p.colors || []).join(', '),
          is_featured: !!p.is_featured,
          is_available: p.is_available !== false,
        })
      }
    }
  }, [isEdit, id, products])

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function setImage(i, value) {
    setForm((f) => {
      const images = [...f.images]
      images[i] = value
      // Keep exactly one empty slot at the end so there's always room to add another.
      if (value && i === images.length - 1) images.push('')
      return { ...f, images }
    })
  }
  function removeImageField(i) {
    setForm((f) => {
      const images = f.images.filter((_, idx) => idx !== i)
      return { ...f, images: images.length ? images : [''] }
    })
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required.'
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter a valid price.'
    if (!form.category_id) e.category_id = 'Select a category.'
    if (!form.images.some((img) => img.trim())) e.images = 'Add at least one image URL.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const category = categories.find((c) => c.id === form.category_id)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim(),
      price: Number(form.price),
      category_id: form.category_id,
      category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
      images: form.images.map((i) => i.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_available: form.is_available,
    }

    const { error } = isEdit ? await updateProduct(id, payload) : await createProduct(payload)
    setSaving(false)

    if (error) {
      push(error, 'error')
      return
    }
    push(isEdit ? 'Product updated.' : 'Product created.')
    navigate('/admin/products')
  }

  return (
    <div className="max-w-2xl">
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-fg hover:text-ink focus-ring rounded">
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mb-6 font-display text-2xl font-semibold">{isEdit ? 'Edit product' : 'Add product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <Label htmlFor="name">Product name</Label>
          <Input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)} aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" placeholder="auto-generated from name if left blank" value={form.slug} onChange={(e) => setField('slug', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (PKR)</Label>
            <Input id="price" type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} aria-invalid={!!errors.price} />
            {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} aria-invalid={!!errors.category_id}>
              <option value="">Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            {errors.category_id && <p className="mt-1 text-sm text-destructive">{errors.category_id}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)} />
        </div>

        <div>
          <Label>Product images</Label>
          <p className="mb-2 text-xs text-muted-fg">Tap a tile to take a photo or choose one from your gallery. The first image is the main photo.</p>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <ImageUploader
                key={i}
                bucket="product-images"
                folder="products"
                value={img}
                onChange={(url) => setImage(i, url)}
                onRemove={() => removeImageField(i)}
                label={i === 0 ? 'Main photo' : 'Add photo'}
              />
            ))}
          </div>
          {errors.images && <p className="mt-1 text-sm text-destructive">{errors.images}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sizes">Sizes (comma separated)</Label>
            <Input id="sizes" placeholder="Small, Medium, Large" value={form.sizes} onChange={(e) => setField('sizes', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="colors">Colors (comma separated)</Label>
            <Input id="colors" placeholder="Natural, Charcoal" value={form.colors} onChange={(e) => setField('colors', e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setField('is_featured', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus-ring" />
            Featured product
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.is_available} onChange={(e) => setField('is_available', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus-ring" />
            Available for order
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}</Button>
          <Link to="/admin/products" className="inline-flex items-center rounded-lg border border-border px-5 text-sm font-medium hover:bg-muted focus-ring">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}