// Image optimization utilities for react-lazy-load-image-component

/**
 * Connection-aware loading configuration
 * Adjusts loading behavior based on user's connection speed
 */
export const getConnectionAwareConfig = () => {
  // Check if navigator.connection is available (Chrome/Edge)
  const connection = (navigator as any)?.connection

  if (!connection) {
    // Default configuration for unknown connections
    return {
      threshold: 100,
      delayTime: 300,
      delayMethod: 'throttle' as const
    }
  }

  const effectiveType = connection.effectiveType

  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return {
        threshold: 50, // Load closer to viewport
        delayTime: 500, // Longer delay for slower connections
        delayMethod: 'debounce' as const
      }
    case '3g':
      return {
        threshold: 100,
        delayTime: 300,
        delayMethod: 'throttle' as const
      }
    case '4g':
    default:
      return {
        threshold: 200, // Load further from viewport
        delayTime: 150, // Shorter delay for fast connections
        delayMethod: 'throttle' as const
      }
  }
}

/**
 * Generate optimized placeholder based on aspect ratio
 */
export const generatePlaceholder = (width: number, height: number) => {
  const aspectRatio = width / height
  const viewBoxWidth = 100
  const viewBoxHeight = Math.round(viewBoxWidth / aspectRatio)

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${viewBoxWidth} ${viewBoxHeight}' style='background:%23f0f0f0'%3E%3C/svg%3E`
}

/**
 * Determine if image should be loaded with priority
 */
export const shouldLoadWithPriority = (
  index?: number,
  isTrending?: boolean,
  isAboveFold?: boolean
) => {
  // Load first few images or trending/above-fold images with priority
  return (index !== undefined && index < 3) || isTrending || isAboveFold
}

/**
 * Check if image is likely cached (same src as previously loaded images)
 */
export const isLikelyCached = (src: string, cachedSources: Set<string>) => {
  return cachedSources.has(src)
}

/**
 * Standard lazy load configuration for different component types
 */
export const LAZY_LOAD_CONFIGS = {
  // For gallery/grid items
  gallery: {
    threshold: 100,
    delayTime: 300,
    delayMethod: 'throttle' as const,
    useIntersectionObserver: true,
    effect: 'blur' as const,
    visibleByDefault: false
  },

  // For hero/featured images
  hero: {
    threshold: 200,
    delayTime: 150,
    delayMethod: 'throttle' as const,
    useIntersectionObserver: true,
    effect: 'blur' as const,
    visibleByDefault: false // Will be set dynamically
  },

  // For thumbnails in lists
  thumbnail: {
    threshold: 50,
    delayTime: 300,
    delayMethod: 'debounce' as const,
    useIntersectionObserver: true,
    effect: 'opacity' as const,
    visibleByDefault: false
  },

  // For priority/above-fold images
  priority: {
    threshold: 300,
    delayTime: 100,
    delayMethod: 'throttle' as const,
    useIntersectionObserver: true,
    effect: 'blur' as const,
    visibleByDefault: false
  }
} as const

/**
 * Enhanced error handling with retry logic
 */
export const createImageErrorHandler = (
  fallbackSrc: string,
  onRetry?: () => void,
  maxRetries: number = 2
) => {
  let retryCount = 0

  return (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget

    if (retryCount < maxRetries && onRetry) {
      retryCount++
      // Add small delay before retry
      setTimeout(() => {
        img.src = img.src // Force reload
        onRetry()
      }, 1000 * retryCount)
    } else {
      // Final fallback
      img.onerror = null // Prevent infinite loop
      img.src = fallbackSrc
    }
  }
}

/**
 * Merge custom config with optimal defaults
 */
export const mergeImageConfig = (customConfig?: {
  effect?: 'blur' | 'opacity' | 'black-and-white' | string
  visibleByDefault?: boolean
  threshold?: number
  delayTime?: number
  delayMethod?: 'throttle' | 'debounce'
  useIntersectionObserver?: boolean
}) => {
  const connectionConfig = getConnectionAwareConfig()
  const baseConfig = { ...LAZY_LOAD_CONFIGS.gallery }

  return {
    ...baseConfig,
    ...connectionConfig,
    ...customConfig
  } as {
    effect: 'blur' | 'opacity' | 'black-and-white' | undefined
    visibleByDefault: boolean
    threshold: number
    delayTime: number
    delayMethod: 'throttle' | 'debounce'
    useIntersectionObserver: boolean
  }
}

/**
 * Image cache management for visibleByDefault optimization
 */
class ImageCacheManager {
  private static instance: ImageCacheManager
  private cachedSources = new Set<string>()

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager()
    }
    return ImageCacheManager.instance
  }

  addToCache(src: string): void {
    this.cachedSources.add(src)
  }

  isInCache(src: string): boolean {
    return this.cachedSources.has(src)
  }

  clearCache(): void {
    this.cachedSources.clear()
  }

  getCacheSize(): number {
    return this.cachedSources.size
  }
}

export const imageCache = ImageCacheManager.getInstance()
