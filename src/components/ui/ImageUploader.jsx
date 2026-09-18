import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { uploadImageToBucket, deleteImageFromBucket } from '../../lib/storage'
import { cn } from '../../lib/utils'
import { useToast } from './Toast'

/**
 * A single image slot: tap to open the device's native picker, which on
 * mobile offers both "Camera" and "Photo Library / Gallery" (no `capture`
 * attribute is set, so the browser shows both options). Uploads straight
 * to the given Supabase Storage bucket and reports back the public URL.
 */
export function ImageUploader({ bucket, folder, value, onChange, onRemove, label = 'Add photo', className }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const { push } = useToast()

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file again later
    if (!file) return

    setUploading(true)
    const { url, error } = await uploadImageToBucket(file, bucket, folder)
    setUploading(false)

    if (error) {
      push(error, 'error')
      return
    }
    onChange(url)
  }

  async function handleRemove() {
    if (value) await deleteImageFromBucket(bucket, value)
    onRemove ? onRemove() : onChange('')
  }

  return (
    <div
      className={cn(
        'relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted',
        className
      )}
    >
      {value ? (
        <>
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-fg hover:text-ink focus-ring disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-5 w-5" aria-hidden="true" />}
          <span className="px-1 text-center text-[11px] font-medium leading-tight">{uploading ? 'Uploading…' : label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="sr-only"
        aria-label={label}
      />
    </div>
  )
}