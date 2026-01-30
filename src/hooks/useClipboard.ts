import { useCallback } from 'react'
import { useAppStore } from '../store'

export function useClipboard() {
  const showToast = useAppStore((s) => s.showToast)

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        showToast('Bagged and ready! Copied to clipboard.', 'success')
      } catch {
        showToast('Failed to copy. Try selecting and copying manually.', 'error')
      }
    },
    [showToast],
  )

  return { copyToClipboard }
}
