import { MessageCircle } from 'lucide-react'
import { buttonVariants } from './ui/Button'
import { getWhatsAppOrderUrl } from '../lib/whatsapp'
import { formatPrice, cn } from '../lib/utils'

export function WhatsAppOrderButton({ product, className, size = 'lg' }) {
  const url = getWhatsAppOrderUrl({ ...product, priceLabel: formatPrice(product.price) })
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: 'whatsapp', size }), className)}
    >
      <MessageCircle className="h-5 w-5" />
      Order on WhatsApp
    </a>
  )
}
