import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { sampleCategories, sampleProducts } from '../lib/sampleData'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSupabaseConfigured) {
        const withCounts = sampleCategories.map((c) => ({
          ...c,
          product_count: sampleProducts.filter((p) => p.category_id === c.id).length,
        }))
        setCategories(withCounts)
        return
      }
      const { data, error: qError } = await supabase.from('categories').select('*').order('name')
      if (qError) throw qError
      setCategories(data || [])
    } catch (err) {
      console.error(err)
      setError('We could not load categories right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { categories, loading, error, reload: load }
}
