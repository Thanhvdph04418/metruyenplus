import { useState, useEffect } from 'react'

interface NavbarVisibilityOptions {
  /** Minimum pixels to scroll before hiding navbar */
  threshold?: number
  /** Delay in ms between visibility checks */
  delay?: number
}

/**
 * Custom hook that manages navbar visibility based on scroll behavior
 * Hides navbar when scrolling down past threshold, shows when scrolling up or at top
 */
const useNavbarVisibility = (options: NavbarVisibilityOptions = {}) => {
  const { threshold = 100, delay = 200 } = options

  const [isVisible, setIsVisible] = useState(true)
  const [scrollDirection, setScrollDirection] = useState('up')
  const [prevOffset, setPrevOffset] = useState(0)
  const [lastScrollTime, setLastScrollTime] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const scrollY = window.pageYOffset

      // Always show navbar when at top
      if (scrollY === 0) {
        setIsVisible(true)
        setScrollDirection('up')
        setPrevOffset(scrollY)
        setLastScrollTime(now)
        return
      }

      // Only update if enough time has passed and minimum scroll threshold is met
      if (now - lastScrollTime > delay && Math.abs(scrollY - prevOffset) > 3) {
        const newDirection = scrollY > prevOffset ? 'down' : 'up'

        // Update scroll direction
        if (newDirection !== scrollDirection) {
          setScrollDirection(newDirection)
        }

        // Show/hide navbar based on direction and threshold
        if (newDirection === 'down' && scrollY > threshold) {
          setIsVisible(false)
        } else if (newDirection === 'up') {
          setIsVisible(true)
        }

        setPrevOffset(scrollY)
        setLastScrollTime(now)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollDirection, prevOffset, lastScrollTime, threshold, delay])

  return { isVisible, scrollDirection }
}

export default useNavbarVisibility
