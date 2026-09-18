import { useState } from 'react'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { Input, Textarea, Label } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { getWhatsAppGeneralUrl } from '../lib/whatsapp'
import { useToast } from '../components/ui/Toast'
import { useStoreSettings } from '../hooks/useStoreSettings'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const { push } = useToast()
  const { settings } = useStoreSettings()

  function handleSubmit(e) {
    e.preventDefault()
    // No backend for contact form — route straight into WhatsApp with the
    // message pre-filled, consistent with the rest of the ordering flow.
    const text = `Hello, my name is ${form.name || 'a visitor'}.\n\n${form.message}\n\n(Reply to: ${form.email || 'no email given'})`
    window.open(getWhatsAppGeneralUrl(text), '_blank', 'noopener,noreferrer')
    push('Opening WhatsApp with your message…')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-semibold">Contact us</h1>
      <p className="mt-2 max-w-lg text-muted-fg">Have a question before you order? Send us a message and we'll get back to you quickly.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit" variant="whatsapp" size="lg">
            <MessageCircle className="h-5 w-5" /> Send via WhatsApp
          </Button>
        </form>

        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Visit us</h2>
              <p className="text-sm text-muted-fg">{settings.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Email</h2>
              <a href={`mailto:${settings.email}`} className="text-sm text-muted-fg hover:text-ink">{settings.email}</a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">WhatsApp</h2>
              <a href={getWhatsAppGeneralUrl()} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-fg hover:text-ink">
                Start a chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
