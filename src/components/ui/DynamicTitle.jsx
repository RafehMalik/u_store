import { useEffect } from 'react'
import { useStoreSettings } from '../../hooks/useStoreSettings'

/**
 * Keeps the browser tab title in sync with the store name from
 * store_settings, instead of the static title in index.html. Renders
 * nothing — mount it once near the root of the app.
 */
export function DynamicTitle() {
  const { settings } = useStoreSettings()

  useEffect(() => {
    if (settings?.store_name) {
      document.title = settings.store_name
    }
  }, [settings])

  return null
}