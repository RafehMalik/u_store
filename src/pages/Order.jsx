import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Button } from '../components/ui/Button'
import { Input, Label, Select, Textarea } from '../components/ui/Input'
import { formatPrice } from '../lib/utils'
import { getStoreWhatsAppNumber } from '../lib/whatsapp'

function Question({ question, value, onChange, error }) {
  const id = question.id
  const options = Array.isArray(question.options) ? question.options : []
  const set = (next) => onChange(id, next)
  return <div><Label htmlFor={id}>{question.label}{question.required && <span className="ml-1 text-destructive">*</span>}</Label>{question.type === 'textarea' ? <Textarea id={id} rows={3} value={value || ''} placeholder={question.placeholder || ''} onChange={(e) => set(e.target.value)} /> : question.type === 'select' ? <Select id={id} value={value || ''} onChange={(e) => set(e.target.value)}><option value="">Select an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</Select> : question.type === 'radio' || question.type === 'yes/no' ? <div className="flex flex-wrap gap-4 pt-2">{(question.type === 'yes/no' ? ['Yes', 'No'] : options).map((option) => <label key={option} className="flex items-center gap-2 text-sm"><input type="radio" name={id} checked={value === option} onChange={() => set(option)} />{option}</label>)}</div> : question.type === 'checkbox' ? <div className="space-y-2 pt-2">{(options.length ? options : ['Yes']).map((option) => { const selected = Array.isArray(value) ? value : value ? ['Yes'] : []; return <label key={option} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(option)} onChange={(e) => set(e.target.checked ? [...selected, option] : selected.filter((item) => item !== option))} />{option}</label> })}</div> : <Input id={id} type={question.type === 'number' ? 'number' : 'text'} value={value || ''} placeholder={question.placeholder || ''} onChange={(e) => set(e.target.value)} />}{error && <p className="mt-1 text-sm text-destructive">{error}</p>}</div>
}

export default function Order() {
  const { items, total, updateAnswers } = useCart()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(() => Object.fromEntries(items.map((item) => [item.productId, item.answers || {}])))
  const [customer, setCustomer] = useState({ name: '', phone: '', city: '', address: '', notes: '' })
  const [errors, setErrors] = useState({})

  if (!items.length) return <div className="container py-16 text-center"><h1 className="font-display text-2xl font-semibold">Your cart is empty</h1><Link to="/products" className="mt-5 inline-block text-primary hover:underline">Browse products</Link></div>

  const item = items[step]
  const isQuestions = step < items.length
  const updateAnswer = (id, value) => setAnswers((current) => ({ ...current, [item.productId]: { ...current[item.productId], [id]: value } }))
  function validateQuestions() {
    const nextErrors = {}
    for (const question of item.orderQuestions || []) {
      const value = answers[item.productId]?.[question.id]
      if (question.required && (value === undefined || value === '' || value === null || (question.type === 'checkbox' && (!Array.isArray(value) || !value.length)))) nextErrors[question.id] = 'This field is required.'
      if (question.type === 'number' && value !== undefined && value !== '' && Number.isNaN(Number(value))) nextErrors[question.id] = 'Enter a valid number.'
    }
    setErrors(nextErrors)
    return !Object.keys(nextErrors).length
  }
  function next() { if (isQuestions && !validateQuestions()) return; if (isQuestions) updateAnswers(item.productId, answers[item.productId] || {}); setErrors({}); setStep((value) => value + 1) }
  function validateCustomer() { const nextErrors = {}; if (!customer.name.trim()) nextErrors.name = 'Name is required.'; if (!customer.phone.trim()) nextErrors.phone = 'WhatsApp number is required.'; if (!customer.city.trim()) nextErrors.city = 'City is required.'; if (!customer.address.trim()) nextErrors.address = 'Delivery address is required.'; setErrors(nextErrors); return !Object.keys(nextErrors).length }
  function review() { if (validateCustomer()) setStep(items.length + 1) }
  function sendWhatsApp() {
    const lines = ['🛒 NEW ORDER', '', 'CUSTOMER', `Name: ${customer.name}`, `WhatsApp: ${customer.phone}`, `City: ${customer.city}`, `Address: ${customer.address}`, customer.notes ? `Notes: ${customer.notes}` : null, '']
    items.forEach((product, index) => { lines.push(`PRODUCT ${index + 1}`, product.name, `Quantity: ${product.quantity}`, `Price: ${formatPrice(product.price * product.quantity)}`); (product.orderQuestions || []).forEach((question) => lines.push(`${question.label}: ${answers[product.productId]?.[question.id] || 'No'}`)); lines.push('', '--------------------------------') })
    lines.push('', `TOTAL: ${formatPrice(total)}`)
    window.open(`https://wa.me/${getStoreWhatsAppNumber()}?text=${encodeURIComponent(lines.filter((line) => line !== null).join('\n'))}`, '_blank', 'noopener,noreferrer')
  }
  const reviewStep = step === items.length + 1
  return <div className="container max-w-3xl py-8"><p className="text-sm font-medium text-primary">{isQuestions ? `Product ${step + 1} of ${items.length}` : reviewStep ? 'Review order' : 'Customer information'}</p>{isQuestions ? <section className="mt-2"><h1 className="font-display text-3xl font-semibold">{item.name}</h1><p className="mt-1 text-muted-fg">Quantity: {item.quantity}</p>{item.orderQuestions?.length ? <div className="mt-8 space-y-5">{item.orderQuestions.map((question) => <Question key={question.id} question={question} value={answers[item.productId]?.[question.id]} onChange={updateAnswer} error={errors[question.id]} />)}</div> : <p className="mt-8 rounded-lg bg-muted p-4 text-sm text-muted-fg">No additional information is needed for this product.</p>}</section> : reviewStep ? <Review items={items} answers={answers} customer={customer} total={total} /> : <section className="mt-2"><h1 className="font-display text-3xl font-semibold">Customer information</h1><div className="mt-8 space-y-5">{[['name', 'Name'], ['phone', 'WhatsApp number'], ['city', 'City'], ['address', 'Delivery address']].map(([key, label]) => <div key={key}><Label htmlFor={key}>{label} *</Label><Input id={key} value={customer[key]} onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })} aria-invalid={!!errors[key]} />{errors[key] && <p className="mt-1 text-sm text-destructive">{errors[key]}</p>}</div>)}<div><Label htmlFor="notes">Additional notes</Label><Textarea id="notes" rows={3} value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} /></div></div></section>}<div className="mt-8 flex flex-wrap justify-between gap-3">{step > 0 && <Button variant="outline" onClick={() => { setErrors({}); setStep((value) => value - 1) }}>Back</Button>}<span />{isQuestions ? <Button onClick={next}>Continue</Button> : reviewStep ? <><Button variant="outline" onClick={() => setStep(items.length)}>Edit order</Button><Button variant="whatsapp" onClick={sendWhatsApp}>Send order on WhatsApp</Button></> : <Button onClick={review}>Review order</Button>}</div></div>
}

function Review({ items, answers, customer, total }) { return <section className="mt-2 space-y-5"><h1 className="font-display text-3xl font-semibold">Order review</h1>{items.map((item, index) => <div key={item.productId} className="rounded-lg border border-border bg-surface p-4"><h2 className="font-display font-semibold">Product {index + 1}: {item.name}</h2><p className="mt-1 text-sm text-muted-fg">Quantity: {item.quantity} · {formatPrice(item.price * item.quantity)}</p>{item.orderQuestions?.map((question) => <p key={question.id} className="mt-2 text-sm"><span className="font-medium">{question.label}</span>: {answers[item.productId]?.[question.id] === true ? 'Yes' : answers[item.productId]?.[question.id] || 'No'}</p>)}</div>)}<div className="rounded-lg border border-border p-4"><h2 className="font-display font-semibold">Customer</h2><p className="mt-2 text-sm leading-6">Name: {customer.name}<br />WhatsApp: {customer.phone}<br />City: {customer.city}<br />Address: {customer.address}{customer.notes && <><br />Notes: {customer.notes}</>}</p><p className="mt-4 text-lg font-semibold">Total: {formatPrice(total)}</p></div></section> }
