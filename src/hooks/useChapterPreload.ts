import { useEffect } from 'react'

/**
 * Custom hook to preload images from the next chapter
 * Improves perceived performance by loading next chapter images in background
 *
 * @param nextChapterImages - Array of image URLs from the next chapter
 * @param enabled - Whether preloading is enabled (default: true)
 */
export const useChapterPreload = (nextChapterImages?: string[], enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || !nextChapterImages || nextChapterImages.length === 0) {
      return
    }

    // Preload first 3 images of next chapter when user is near the end
    const preloadImages = nextChapterImages.slice(0, 3)

    const imageElements: HTMLImageElement[] = []

    preloadImages.forEach((src) => {
      const img = new Image()
      img.src = src
      imageElements.push(img)
    })

    // Cleanup function to abort any ongoing loads
    return () => {
      imageElements.forEach((img) => {
        img.src = '' // Cancel loading
      })
    }
  }, [nextChapterImages, enabled])
}
