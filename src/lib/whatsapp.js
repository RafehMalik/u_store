// Central WhatsApp ordering config. The number is read from an environment
// variable (or, once connected, from the store_settings table) rather than
// being hard-coded across components.
const ENV_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923001234567'

let storeNumber = ENV_NUMBER

export function setStoreWhatsAppNumber(number) {
  if (number) storeNumber = number.replace(/\D/g, '')
}

export function getStoreWhatsAppNumber() {
  return storeNumber
}

export function buildProductOrderMessage(product) {
  const lines = [
    'Hello, I would like to order:',
    '',
    `Product: ${product.name}`,
    product.id ? `Product ID: ${product.id}` : null,
    `Price: ${product.priceLabel || product.price}`,
    '',
    'Please let me know availability and how to proceed.',
  ].filter(Boolean)
  return lines.join('\n')
}

export function getWhatsAppOrderUrl(product) {
  const message = buildProductOrderMessage(product)
  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`
}

export function getWhatsAppGeneralUrl(message = 'Hello! I have a question about your products.') {
  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`
}
