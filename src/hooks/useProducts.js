import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { sampleProducts } from '../lib/sampleData'

/**
 * Loads products, optionally filtered/sorted. Falls back to sample data
 * when Supabase isn't configured yet, so the storefront always renders.
 */
export function useProducts({ categorySlug, search, sort, onlyFeatured } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSupabaseConfigured) {
        let list = [...sampleProducts]
        if (categorySlug) list = list.filter((p) => p.category?.slug === categorySlug)
        if (onlyFeatured) list = list.filter((p) => p.is_featured)
        if (search) {
          const q = search.toLowerCase()
          list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        }
        list = sortProducts(list, sort)
        setProducts(list)
        return
      }

      // Filtering on an *embedded* table's column (category.slug) only
      // restricts which rows come back if the embed is an inner join —
      // otherwise PostgREST just nulls out the embed for non-matching rows
      // and still returns every product, which is why this looked like it
      // "sometimes" worked. The !inner hint makes the .eq() below actually
      // filter the products themselves.
      const categoryEmbed = categorySlug ? 'category:categories!inner(id, name, slug)' : 'category:categories(id, name, slug)'

      let query = supabase
        .from('products')
        .select(`*, ${categoryEmbed}`)
        .eq('is_available', true)

      if (categorySlug) query = query.eq('category.slug', categorySlug)
      if (onlyFeatured) query = query.eq('is_featured', true)
      if (search) query = query.ilike('name', `%${search}%`)

      const { data, error: qError } = await query
      if (qError) throw qError
      setProducts(sortProducts(data || [], sort))
    } catch (err) {
      console.error(err)
      setError('We could not load products right now.')
    } finally {
      setLoading(false)
    }
  }, [categorySlug, search, sort, onlyFeatured])

  useEffect(() => { load() }, [load])

  return { products, loading, error, reload: load }
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        if (!isSupabaseConfigured) {
          const found = sampleProducts.find((p) => p.slug === slug)
          if (!ignore) setProduct(found || null)
          return
        }
        const { data, error: qError } = await supabase
          .from('products')
          .select('*, category:categories(id, name, slug)')
          .eq('slug', slug)
          .single()
        if (qError) throw qError
        if (!ignore) setProduct(data)
      } catch (err) {
        console.error(err)
        if (!ignore) setError('We could not load this product.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [slug])

  return { product, loading, error }
}

function sortProducts(list, sort) {
  const arr = [...list]
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return arr.sort((a, b) => (b.is_featured === a.is_featured ? 0 : b.is_featured ? 1 : -1))
  }
}