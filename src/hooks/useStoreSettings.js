import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { sampleStoreSettings } from '../lib/sampleData'

/**
 * Public, read-only access to the single store_settings row (store name,
 * description, WhatsApp number, email, address, social links). Falls back
 * to sample data until Supabase is connected, so the storefront always has
 * something sensible to render.
 */
export function useStoreSettings() {
  const [settings, setSettings] = useState(sampleStoreSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (!isSupabaseConfigured) {
          if (!ignore) setSettings(sampleStoreSettings)
          return
        }
        const { data, error: qError } = await supabase.from('store_settings').select('*').single()
        if (qError) throw qError
        if (!ignore && data) setSettings(data)
      } catch (err) {
        console.error(err)
        if (!ignore) setError('Could not load store details.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [])

  return { settings, loading, error }
}