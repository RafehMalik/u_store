import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { Button } from '../components/ui/Button'
import { formatPrice } from '../lib/utils'

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  if (!items.length) {
    return <div className="container py-16 text-center"><h1 className="font-display text-2xl font-semibold">Your cart is empty</h1><p className="mt-2 text-muted-fg">Add products to build your order.</p><Link to="/products" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-fg">Browse products</Link></div>
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-semibold">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-lg border border-border bg-surface p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">{item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1"><h2 className="font-display font-semibold">{item.name}</h2><p className="mt-1 text-sm text-muted-fg">{formatPrice(item.price)} each</p><div className="mt-3 flex items-center gap-2"><button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded border border-border"><Minus className="h-4 w-4" /></button><span className="w-8 text-center text-sm">{item.quantity}</span><button type="button" aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded border border-border"><Plus className="h-4 w-4" /></button></div></div>
              <div className="flex flex-col items-end justify-between"><p className="font-semibold">{formatPrice(item.price * item.quantity)}</p><button type="button" onClick={() => removeFromCart(item.productId)} aria-label={`Remove ${item.name}`} className="text-muted-fg hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-border bg-surface p-5"><div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div><Button className="mt-5 w-full" onClick={() => navigate('/order')}>Continue to order</Button><Link to="/products" className="mt-3 block text-center text-sm text-muted-fg hover:text-ink">Continue shopping</Link></aside>
      </div>
    </div>
  )
}
