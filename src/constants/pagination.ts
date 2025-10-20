/**
 * Device-specific pagination limits for optimal performance and user experience
 */
export interface DeviceLimit {
  breakpoint: number
  device: 'mobile' | 'tablet' | 'desktop'
  limit: number
  description: string
}

/**
 * Pagination limits for Home Comic List (smaller, optimized for quick loading)
 * Used on the home page for initial content display
 */
export const HOME_COMIC_LIST_LIMITS: DeviceLimit[] = [
  {
    breakpoint: 0,
    device: 'mobile',
    limit: 34,
    description: 'Mobile home page - quick loading with essential content'
  },
  {
    breakpoint: 768,
    device: 'tablet',
    limit: 32,
    description: 'Tablet home page - balanced quick loading'
  },
  {
    breakpoint: 1024,
    device: 'desktop',
    limit: 35,
    description: 'Desktop home page - optimized preview content'
  }
]

/**
 * Pagination limits for full Comic List pages (when clicking "Xem thêm")
 * Used for dedicated comic listing pages with more comprehensive content
 */
export const COMIC_LIST_LIMITS: DeviceLimit[] = [
  {
    breakpoint: 0,
    device: 'mobile',
    limit: 32,
    description: 'Mobile listing page - comprehensive content per page'
  },
  {
    breakpoint: 768,
    device: 'tablet',
    limit: 32,
    description: 'Tablet listing page - enhanced content display'
  },
  {
    breakpoint: 1024,
    device: 'desktop',
    limit: 35,
    description: 'Desktop listing page - maximum content with good performance'
  }
]

/**
 * Legacy: Keep for backward compatibility
 * @deprecated Use HOME_COMIC_LIST_LIMITS or COMIC_LIST_LIMITS instead
 */
export const DEVICE_PAGINATION_LIMITS = HOME_COMIC_LIST_LIMITS

/**
 * Get the appropriate pagination limit based on screen width and limit type
 * @param screenWidth - Current screen width in pixels
 * @param limitType - Type of limit to use ('home' for home page, 'list' for full listing pages)
 * @returns The limit for the current device type
 */
export const getPaginationLimitByScreenWidth = (
  screenWidth: number,
  limitType: 'home' | 'list' = 'home'
): number => {
  const limits = limitType === 'home' ? HOME_COMIC_LIST_LIMITS : COMIC_LIST_LIMITS

  // Find the appropriate limit by checking breakpoints in reverse order
  for (let i = limits.length - 1; i >= 0; i--) {
    if (screenWidth >= limits[i].breakpoint) {
      return limits[i].limit
    }
  }

  // Fallback to mobile limit if no match found
  return limits[0].limit
}

/**
 * Get the current device type based on screen width
 * @param screenWidth - Current screen width in pixels
 * @returns The device type string
 */
export const getDeviceType = (screenWidth: number): 'mobile' | 'tablet' | 'desktop' => {
  // Use HOME_COMIC_LIST_LIMITS as reference for device detection (same breakpoints)
  for (let i = HOME_COMIC_LIST_LIMITS.length - 1; i >= 0; i--) {
    if (screenWidth >= HOME_COMIC_LIST_LIMITS[i].breakpoint) {
      return HOME_COMIC_LIST_LIMITS[i].device
    }
  }

  return 'mobile'
}

/**
 * Get current pagination limit based on window width and limit type
 * @param limitType - Type of limit to use ('home' for home page, 'list' for full listing pages)
 * @returns The current pagination limit
 */
export const getCurrentPaginationLimit = (limitType: 'home' | 'list' = 'home'): number => {
  if (typeof window !== 'undefined') {
    return getPaginationLimitByScreenWidth(window.innerWidth, limitType)
  }

  // Server-side rendering fallback
  const limits = limitType === 'home' ? HOME_COMIC_LIST_LIMITS : COMIC_LIST_LIMITS
  return limits[0].limit
}

/**
 * Default limits for quick access
 */
export const DEFAULT_LIMITS = {
  HOME: {
    MOBILE: HOME_COMIC_LIST_LIMITS[0].limit,
    TABLET: HOME_COMIC_LIST_LIMITS[1].limit,
    DESKTOP: HOME_COMIC_LIST_LIMITS[2].limit
  },
  LIST: {
    MOBILE: COMIC_LIST_LIMITS[0].limit,
    TABLET: COMIC_LIST_LIMITS[1].limit,
    DESKTOP: COMIC_LIST_LIMITS[2].limit
  }
} as const
