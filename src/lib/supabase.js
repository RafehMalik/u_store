import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app runs fine without Supabase configured yet (falls back to sample
// data throughout the hooks), so we don't throw here — we just flag it.
export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes('your-project-ref'))

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
