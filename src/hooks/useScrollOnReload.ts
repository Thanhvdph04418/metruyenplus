import { useEffect } from 'react'

/**
 * Custom hook that scrolls to top only when the page is reloaded
 * (not on regular navigation between routes)
 */
export default function useScrollOnReload() {
  useEffect(() => {
    // Check if the current page load was a reload using Performance Navigation API
    const navigationEntries = performance.getEntriesByType(
      'navigation'
    ) as PerformanceNavigationTiming[]

    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, []) // Empty dependency array - run only once on mount
}
