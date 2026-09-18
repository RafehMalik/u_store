import { supabase, isSupabaseConfigured } from './supabase'

const MAX_FILE_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateImageFile(file) {
  if (!file) return 'No file selected.'
  if (!ALLOWED_TYPES.includes(file.type)) return 'Please choose a JPG, PNG, WEBP or GIF image.'
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`
  return null
}

/**
 * Uploads a File to the given Supabase Storage bucket and returns its
 * public URL. Buckets (product-images, category-images, store-assets) and
 * their public-read / admin-write policies are created by supabase/schema.sql.
 *
 * In preview mode (Supabase not configured yet) this falls back to a local
 * object URL so the admin UI is still fully clickable — nothing is actually
 * persisted until Supabase is connected.
 */
export async function uploadImageToBucket(file, bucket, folder = '') {
  const validationError = validateImageFile(file)
  if (validationError) return { url: null, error: validationError }

  if (!isSupabaseConfigured) {
    return { url: URL.createObjectURL(file), error: null }
  }

  const ext = file.name.split('.').pop()
  const path = `${folder ? `${folder}/` : ''}${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/** Best-effort delete of a previously uploaded image, given its public URL. */
export async function deleteImageFromBucket(bucket, url) {
  if (!isSupabaseConfigured || !url) return
  try {
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return // not a Supabase-hosted URL (e.g. sample data) — nothing to clean up
    const path = url.slice(idx + marker.length)
    await supabase.storage.from(bucket).remove([path])
  } catch {
    // Cleanup is best-effort; ignore failures here.
  }
}