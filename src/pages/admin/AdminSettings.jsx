import { useEffect, useState } from 'react'
import { useAdminSettings } from '../../hooks/useAdminData'
import { Input, Label, Textarea } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { setStoreWhatsAppNumber } from '../../lib/whatsapp'

export default function AdminSettings() {
  const { settings, loading, saveSettings } = useAdminSettings()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  useEffect(() => { setForm(settings) }, [settings])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await saveSettings(form)
    setSaving(false)
    if (error) {
      push(error, 'error')
      return
    }
    setStoreWhatsAppNumber(form.whatsapp_number)
    push('Settings saved.')
  }

  if (loading) return <p className="text-sm text-muted-fg">Loading settings…</p>

  return (
    <div className="max-w-xl">
      <h1 className="mb-1 font-display text-2xl font-semibold">Store settings</h1>
      <p className="mb-6 text-sm text-muted-fg">These details power your storefront and the WhatsApp ordering link.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="store_name">Store name</Label>
          <Input id="store_name" value={form.store_name || ''} onChange={(e) => setForm({ ...form, store_name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="description">Store description</Label>
          <Textarea id="description" rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="whatsapp_number">WhatsApp number</Label>
          <Input
            id="whatsapp_number"
            value={form.whatsapp_number || ''}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            placeholder="923001234567 (country code, no + or spaces)"
          />
        </div>
        <div>
          <Label htmlFor="email">Contact email</Label>
          <Input id="email" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={form.social_links?.instagram || ''}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={form.social_links?.facebook || ''}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, facebook: e.target.value } })}
            />
          </div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
      </form>
    </div>
  )
}
