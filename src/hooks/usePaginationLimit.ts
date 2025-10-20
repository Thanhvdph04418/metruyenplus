import { useState, useEffect } from 'react'
import {
  getPaginationLimitByScreenWidth,
  getDeviceType,
  HOME_COMIC_LIST_LIMITS
} from '@/constants/pagination'

/**
 * Custom hook to get responsive pagination limit based on screen size
 * Updates automatically on window resize
 * @param limitType - Type of limit to use ('home' for home page, 'list' for full listing pages)
 */
export const usePaginationLimit = (limitType: 'home' | 'list' = 'home') => {
  const [limit, setLimit] = useState(() => {
    if (typeof window !== 'undefined') {
      return getPaginationLimitByScreenWidth(window.innerWidth, limitType)
    }
    return HOME_COMIC_LIST_LIMITS[0].limit // Default mobile limit for SSR
  })

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      return getDeviceType(window.innerWidth)
    }
    return 'mobile' // Default for SSR
  })

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getPaginationLimitByScreenWidth(window.innerWidth, limitType)
      const newDeviceType = getDeviceType(window.innerWidth)

      setLimit(newLimit)
      setDeviceType(newDeviceType)
    }

    // Set initial values
    handleResize()

    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [limitType])

  return {
    limit,
    deviceType,
    limitType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  }
}

/**
 * Specific hooks for different use cases
 */
export const useHomeComicLimit = () => usePaginationLimit('home')
export const useComicListLimit = () => usePaginationLimit('list')
