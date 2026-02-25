import { useState, useCallback } from 'react'

export interface ImageLoadingStats {
  loaded: number
  failed: number
  total: number
}

/**
 * Custom hook to track image loading statistics
 * Returns stats object and callback functions to update stats
 */
export const useImageLoadingStats = (totalImages: number) => {
  const [stats, setStats] = useState<ImageLoadingStats>({
    loaded: 0,
    failed: 0,
    total: totalImages
  })

  const onImageLoad = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      loaded: prev.loaded + 1
    }))
  }, [])

  const onImageError = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      failed: prev.failed + 1
    }))
  }, [])

  const resetStats = useCallback(() => {
    setStats({
      loaded: 0,
      failed: 0,
      total: totalImages
    })
  }, [totalImages])

  return {
    stats,
    onImageLoad,
    onImageError,
    resetStats
  }
}
