import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { sampleProducts, sampleCategories, sampleStoreSettings } from '../lib/sampleData'
import { slugify } from '../lib/utils'

// In preview mode (no Supabase configured) these hooks operate on an
// in-memory copy of the sample data so the admin UI is fully clickable.
// Once Supabase is connected, every call reads/writes the real tables.

let memoryProducts = [...sampleProducts]
let memoryCategories = [...sampleCategories]
let memorySettings = { ...sampleStoreSettings }

function stripJoinFields(input) {
  const { category, ...rest } = input
  return rest
}

export function useAdminProducts() {
  const [products, setProducts] = useState(memoryProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSupabaseConfigured) {
        setProducts([...memoryProducts])
        return
      }
      const { data, error: qError } = await supabase
        .from('products')
        .select('*, category:categories(id, name, slug)')
        .order('created_at', { ascending: false })
      if (qError) throw qError
      setProducts(data || [])
    } catch (err) {
      console.error(err)
      setError('Could not load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function createProduct(input) {
    const payload = { ...input, slug: input.slug || slugify(input.name) }
    if (!isSupabaseConfigured) {
      const record = { ...payload, id: `p${Date.now()}`, created_at: new Date().toISOString() }
      memoryProducts = [record, ...memoryProducts]
      setProducts([...memoryProducts])
      return { error: null }
    }
    const { error } = await supabase.from('products').insert(stripJoinFields(payload))
    if (!error) await load()
    return { error: error?.message || null }
  }

  async function updateProduct(id, input) {
    if (!isSupabaseConfigured) {
      memoryProducts = memoryProducts.map((p) => (p.id === id ? { ...p, ...input } : p))
      setProducts([...memoryProducts])
      return { error: null }
    }
    const { error } = await supabase.from('products').update(stripJoinFields(input)).eq('id', id)
    if (!error) await load()
    return { error: error?.message || null }
  }

  async function deleteProduct(id) {
    if (!isSupabaseConfigured) {
      memoryProducts = memoryProducts.filter((p) => p.id !== id)
      setProducts([...memoryProducts])
      return { error: null }
    }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) await load()
    return { error: error?.message || null }
  }

  return { products, loading, error, reload: load, createProduct, updateProduct, deleteProduct }
}

export function useAdminCategories() {
  const [categories, setCategories] = useState(memoryCategories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSupabaseConfigured) {
        setCategories([...memoryCategories])
        return
      }
      const { data, error: qError } = await supabase.from('categories').select('*').order('name')
      if (qError) throw qError
      setCategories(data || [])
    } catch (err) {
      console.error(err)
      setError('Could not load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function createCategory(input) {
    const payload = { ...input, slug: input.slug || slugify(input.name) }
    if (!isSupabaseConfigured) {
      const record = { ...payload, id: `c${Date.now()}` }
      memoryCategories = [...memoryCategories, record]
      setCategories([...memoryCategories])
      return { error: null }
    }
    const { error } = await supabase.from('categories').insert(payload)
    if (!error) await load()
    return { error: error?.message || null }
  }

  async function updateCategory(id, input) {
    if (!isSupabaseConfigured) {
      memoryCategories = memoryCategories.map((c) => (c.id === id ? { ...c, ...input } : c))
      setCategories([...memoryCategories])
      return { error: null }
    }
    const { error } = await supabase.from('categories').update(input).eq('id', id)
    if (!error) await load()
    return { error: error?.message || null }
  }

  async function deleteCategory(id, productsInCategory) {
    if (productsInCategory > 0) {
      return { error: 'Move or delete the products in this category before deleting it.' }
    }
    if (!isSupabaseConfigured) {
      memoryCategories = memoryCategories.filter((c) => c.id !== id)
      setCategories([...memoryCategories])
      return { error: null }
    }
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) await load()
    return { error: error?.message || null }
  }

  return { categories, loading, error, reload: load, createCategory, updateCategory, deleteCategory }
}

export function useAdminSettings() {
  const [settings, setSettings] = useState(memorySettings)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        setSettings({ ...memorySettings })
        return
      }
      const { data, error } = await supabase.from('store_settings').select('*').single()
      if (!error && data) setSettings(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function saveSettings(input) {
    if (!isSupabaseConfigured) {
      memorySettings = { ...memorySettings, ...input }
      setSettings({ ...memorySettings })
      return { error: null }
    }
    const { error } = await supabase.from('store_settings').update(input).eq('id', settings.id)
    if (!error) await load()
    return { error: error?.message || null }
  }

  return { settings, loading, saveSettings }
}
