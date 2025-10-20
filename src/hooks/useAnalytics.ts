import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, isAnalyticsAvailable } from '@/utils/analytics'

/**
 * Hook to automatically track page views when route changes
 * This hook should be used at the app level or layout level
 */
export const usePageTracking = (): void => {
  const location = useLocation()

  useEffect(() => {
    if (isAnalyticsAvailable()) {
      // Track page view with current pathname
      trackPageView(location.pathname + location.search)
    }
  }, [location.pathname, location.search])
}

/**
 * Hook to track page view manually with custom title
 * Useful for dynamic pages or when you want to override the default title
 */
export const useCustomPageTracking = (
  path?: string,
  title?: string,
  dependencies: React.DependencyList = []
): void => {
  const location = useLocation()

  useEffect(() => {
    if (isAnalyticsAvailable()) {
      const trackingPath = path || location.pathname + location.search
      trackPageView(trackingPath, title)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, path, title, ...dependencies])
}
