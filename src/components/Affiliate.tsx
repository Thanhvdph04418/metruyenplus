import { useEffect } from 'react'
import { initializeAffiliateTracking } from '@/utils/affiliate'

/**
 * Affiliate Initialization Component
 *
 * Initializes affiliate tracking on ComicsChapter page mount.
 * Actual trigger happens on chapter navigation events (not timer-based).
 *
 * Tracking logic:
 * - First chapter change: After 15 minutes from first visit (configurable via VITE_AFFILIATE_FIRST_DELAY_MS)
 * - Subsequent: After 1 hour from last trigger (configurable via VITE_AFFILIATE_REPEAT_DELAY_MS)
 *
 * This component only sets up tracking state, actual trigger is in useChapterNavigation hook.
 */
const Affiliate = () => {
  useEffect(() => {
    // Initialize tracking on component mount (first visit to reading page)
    initializeAffiliateTracking()

    if (import.meta.env.DEV) {
      console.log('[Affiliate] Tracking initialized for ComicsChapter page')
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default Affiliate
