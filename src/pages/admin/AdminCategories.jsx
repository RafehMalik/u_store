// import { useState } from 'react'
// import { Plus, Pencil, Trash2 } from 'lucide-react'
// import { useAdminCategories, useAdminProducts } from '../../hooks/useAdminData'
// import { Button } from '../../components/ui/Button'
// import { Dialog } from '../../components/ui/Dialog'
// import { Input, Label, Textarea } from '../../components/ui/Input'
// import { useToast } from '../../components/ui/Toast'
// import { EmptyState } from '../../components/States'

// const emptyForm = { name: '', description: '', image_url: '' }

// export default function AdminCategories() {
//   const { categories, createCategory, updateCategory, deleteCategory } = useAdminCategories()
//   const { products } = useAdminProducts()
//   const { push } = useToast()

//   const [editing, setEditing] = useState(null) // category or 'new' or null
//   const [form, setForm] = useState(emptyForm)
//   const [pendingDelete, setPendingDelete] = useState(null)

//   function openNew() {
//     setForm(emptyForm)
//     setEditing('new')
//   }
//   function openEdit(cat) {
//     setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' })
//     setEditing(cat)
//   }

//   async function handleSave(e) {
//     e.preventDefault()
//     if (!form.name.trim()) {
//       push('Category name is required.', 'error')
//       return
//     }
//     const result = editing === 'new'
//       ? await createCategory(form)
//       : await updateCategory(editing.id, form)
//     if (result.error) {
//       push(result.error, 'error')
//       return
//     }
//     push(editing === 'new' ? 'Category created.' : 'Category updated.')
//     setEditing(null)
//   }

//   function countFor(catId) {
//     return products.filter((p) => p.category_id === catId || p.category?.id === catId).length
//   }

//   async function confirmDelete() {
//     const count = countFor(pendingDelete.id)
//     const result = await deleteCategory(pendingDelete.id, count)
//     setPendingDelete(null)
//     push(result.error || 'Category deleted.', result.error ? 'error' : 'success')
//   }

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-semibold">Categories</h1>
//           <p className="text-sm text-muted-fg">{categories.length} categories</p>
//         </div>
//         <Button size="sm" onClick={openNew}>
//           <Plus className="h-4 w-4" /> Add category
//         </Button>
//       </div>

//       {categories.length === 0 ? (
//         <EmptyState title="No categories yet" action={<Button className="mt-4" onClick={openNew}>Add category</Button>} />
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {categories.map((c) => (
//             <div key={c.id} className="overflow-hidden rounded-lg border border-border bg-surface">
//               <img src={c.image_url} alt="" className="h-32 w-full object-cover bg-muted" />
//               <div className="p-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="font-medium">{c.name}</p>
//                     <p className="text-sm text-muted-fg">{countFor(c.id)} products</p>
//                   </div>
//                   <div className="flex gap-1">
//                     <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} className="rounded-md p-2 hover:bg-muted focus-ring">
//                       <Pencil className="h-4 w-4" />
//                     </button>
//                     <button onClick={() => setPendingDelete(c)} aria-label={`Delete ${c.name}`} className="rounded-md p-2 text-destructive hover:bg-destructive/10 focus-ring">
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <Dialog open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add category' : `Edit ${editing?.name || ''}`}>
//         <form onSubmit={handleSave} className="space-y-4">
//           <div>
//             <Label htmlFor="cat-name">Name</Label>
//             <Input id="cat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//           </div>
//           <div>
//             <Label htmlFor="cat-desc">Description</Label>
//             <Textarea id="cat-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//           </div>
//           <div>
//             <Label htmlFor="cat-image">Image URL</Label>
//             <Input id="cat-image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" />
//           </div>
//           <div className="flex justify-end gap-2 pt-1">
//             <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
//             <Button type="submit">{editing === 'new' ? 'Create' : 'Save'}</Button>
//           </div>
//         </form>
//       </Dialog>

//       <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete category?">
//         <p className="text-sm text-muted-fg">
//           This will permanently remove <strong className="text-ink">{pendingDelete?.name}</strong>. Categories with products can't be deleted until those products are moved or removed.
//         </p>
//         <div className="mt-5 flex justify-end gap-2">
//           <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
//           <Button variant="destructive" onClick={confirmDelete}>Delete category</Button>
//         </div>
//       </Dialog>
//     </div>
//   )
// }

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAdminCategories, useAdminProducts } from '../../hooks/useAdminData'
import { Button } from '../../components/ui/Button'
import { Dialog } from '../../components/ui/Dialog'
import { Input, Label, Textarea } from '../../components/ui/Input'
import { ImageUploader } from '../../components/ui/ImageUploader'
import { useToast } from '../../components/ui/Toast'
import { EmptyState } from '../../components/States'

const emptyForm = { name: '', description: '', image_url: '' }

export default function AdminCategories() {
  const { categories, createCategory, updateCategory, deleteCategory } = useAdminCategories()
  const { products } = useAdminProducts()
  const { push } = useToast()

  const [editing, setEditing] = useState(null) // category or 'new' or null
  const [form, setForm] = useState(emptyForm)
  const [pendingDelete, setPendingDelete] = useState(null)

  function openNew() {
    setForm(emptyForm)
    setEditing('new')
  }
  function openEdit(cat) {
    setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' })
    setEditing(cat)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      push('Category name is required.', 'error')
      return
    }
    const result = editing === 'new'
      ? await createCategory(form)
      : await updateCategory(editing.id, form)
    if (result.error) {
      push(result.error, 'error')
      return
    }
    push(editing === 'new' ? 'Category created.' : 'Category updated.')
    setEditing(null)
  }

  function countFor(catId) {
    return products.filter((p) => p.category_id === catId || p.category?.id === catId).length
  }

  async function confirmDelete() {
    const count = countFor(pendingDelete.id)
    const result = await deleteCategory(pendingDelete.id, count)
    setPendingDelete(null)
    push(result.error || 'Category deleted.', result.error ? 'error' : 'success')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-fg">{categories.length} categories</p>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" action={<Button className="mt-4" onClick={openNew}>Add category</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-lg border border-border bg-surface">
              <img src={c.image_url} alt="" className="h-32 w-full object-cover bg-muted" />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-fg">{countFor(c.id)} products</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} className="rounded-md p-2 hover:bg-muted focus-ring">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setPendingDelete(c)} aria-label={`Delete ${c.name}`} className="rounded-md p-2 text-destructive hover:bg-destructive/10 focus-ring">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add category' : `Edit ${editing?.name || ''}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="cat-name">Name</Label>
            <Input id="cat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea id="cat-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label>Category image</Label>
            <ImageUploader
              bucket="category-images"
              folder="categories"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              onRemove={() => setForm({ ...form, image_url: '' })}
              label="Upload image"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit">{editing === 'new' ? 'Create' : 'Save'}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete category?">
        <p className="text-sm text-muted-fg">
          This will permanently remove <strong className="text-ink">{pendingDelete?.name}</strong>. Categories with products can't be deleted until those products are moved or removed.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDelete}>Delete category</Button>
        </div>
      </Dialog>
    </div>
  )
}