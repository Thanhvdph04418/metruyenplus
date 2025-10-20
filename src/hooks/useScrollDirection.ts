import { useState, useEffect } from 'react'

/**
 * Custom hook that tracks scroll direction and position
 * Returns scroll direction ('up' | 'down') with optimized performance
 */
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up')
  const [prevOffset, setPrevOffset] = useState(0)
  const [lastScrollTime, setLastScrollTime] = useState(0)

  useEffect(() => {
    const toggleScrollDirection = () => {
      const now = Date.now()
      const scrollY = window.pageYOffset

      // Minimum scroll amount before triggering direction change (in pixels)
      const minScroll = 3
      // Minimum time between direction changes (in milliseconds)
      const scrollDelay = 200

      // Only update if enough time has passed and minimum scroll threshold is met
      if (now - lastScrollTime > scrollDelay && Math.abs(scrollY - prevOffset) > minScroll) {
        if (scrollY === 0) {
          setScrollDirection('up')
        } else if (scrollY > prevOffset) {
          setScrollDirection('down')
        } else if (scrollY < prevOffset) {
          setScrollDirection('up')
        }
        setPrevOffset(scrollY)
        setLastScrollTime(now)
      }
    }

    window.addEventListener('scroll', toggleScrollDirection)
    return () => window.removeEventListener('scroll', toggleScrollDirection)
  }, [prevOffset, lastScrollTime])

  return scrollDirection
}

export default useScrollDirection
