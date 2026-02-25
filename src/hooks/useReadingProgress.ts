import { useState, useEffect } from 'react'

/**
 * Custom hook to track reading progress based on scroll position
 * Returns progress percentage (0-100)
 */
export const useReadingProgress = (): number => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight

      if (height <= 0) {
        setProgress(0)
        return
      }

      const percentage = Math.round((scrolled / height) * 100)
      setProgress(Math.min(100, Math.max(0, percentage)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
