import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const storageKey = 'a-store-cart'

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  function addToCart(product) {
    if (!product?.id || product.is_available === false) return
    setItems((current) => {
      const found = current.find((item) => item.productId === product.id)
      if (found) return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price) || 0,
        image: product.images?.[0] || '',
        orderQuestions: Array.isArray(product.order_questions) ? product.order_questions : [],
        quantity: 1,
        answers: {},
      }]
    })
  }

  function updateQuantity(productId, quantity) {
    setItems((current) => current.map((item) => item.productId === productId
      ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
      : item))
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }

  function updateAnswers(productId, answers) {
    setItems((current) => current.map((item) => item.productId === productId ? { ...item, answers } : item))
  }

  function clearCart() {
    setItems([])
  }

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addToCart,
    updateQuantity,
    removeFromCart,
    updateAnswers,
    clearCart,
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
