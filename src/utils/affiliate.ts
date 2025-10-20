/**
 * Affiliate Link Trigger System
 *
 * Opens affiliate link on chapter navigation with rate limiting:
 * - First chapter change: After 15 minutes from first visit (configurable)
 * - Subsequent changes: After 1 hour from last trigger (configurable)
 *
 * Trigger is event-driven (on user chapter navigation), not timer-based.
 */

// Environment configuration with defaults
const AFFILIATE_URL = import.meta.env.VITE_AFFILIATE_URL || 'https://comic-aff.vercel.app'
const FIRST_DELAY_MS = Number(import.meta.env.VITE_AFFILIATE_FIRST_DELAY_MS) || 900000 // 15 minutes
const REPEAT_DELAY_MS = Number(import.meta.env.VITE_AFFILIATE_REPEAT_DELAY_MS) || 3600000 // 1 hour

// localStorage keys
const STORAGE_KEYS = {
  FIRST_VISIT: 'affiliate_first_visit',
  LAST_TRIGGERED: 'affiliate_last_triggered',
  TRIGGER_COUNT: 'affiliate_trigger_count'
} as const

// Type definitions
interface AffiliateState {
  firstVisit: number
  lastTriggered: number
  triggerCount: number
}

/**
 * Initialize affiliate tracking on first visit
 * Sets up first_visit timestamp if it doesn't exist
 */
export const initializeAffiliateTracking = (): void => {
  try {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT)

    if (!firstVisit) {
      const now = Date.now()
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, String(now))
      localStorage.setItem(STORAGE_KEYS.TRIGGER_COUNT, '0')

      if (import.meta.env.DEV) {
        console.log('[Affiliate] Initialized tracking:', {
          firstVisit: now,
          firstDelay: FIRST_DELAY_MS,
          repeatDelay: REPEAT_DELAY_MS
        })
      }
    }
  } catch (error) {
    console.warn('[Affiliate] localStorage unavailable:', error)
  }
}

/**
 * Get current affiliate state from localStorage
 */
export const getAffiliateState = (): AffiliateState | null => {
  try {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT)
    const lastTriggered = localStorage.getItem(STORAGE_KEYS.LAST_TRIGGERED)
    const triggerCount = localStorage.getItem(STORAGE_KEYS.TRIGGER_COUNT)

    if (!firstVisit) {
      return null
    }

    return {
      firstVisit: Number(firstVisit),
      lastTriggered: lastTriggered ? Number(lastTriggered) : 0,
      triggerCount: triggerCount ? Number(triggerCount) : 0
    }
  } catch (error) {
    console.warn('[Affiliate] Failed to get state:', error)
    return null
  }
}

/**
 * Check if affiliate link should be triggered
 */
export const shouldTriggerAffiliate = (): boolean => {
  const state = getAffiliateState()

  if (!state) {
    return false
  }

  const now = Date.now()

  if (state.triggerCount === 0) {
    // First time: Check if 15 minutes (or configured) have passed
    const shouldTrigger = now - state.firstVisit >= FIRST_DELAY_MS

    if (import.meta.env.DEV && shouldTrigger) {
      console.log('[Affiliate] First trigger ready:', {
        timeSinceFirstVisit: now - state.firstVisit,
        requiredDelay: FIRST_DELAY_MS
      })
    }

    return shouldTrigger
  } else {
    // Subsequent times: Check if 1 hour (or configured) has passed since last trigger
    const shouldTrigger = now - state.lastTriggered >= REPEAT_DELAY_MS

    if (import.meta.env.DEV && shouldTrigger) {
      console.log('[Affiliate] Repeat trigger ready:', {
        timeSinceLastTrigger: now - state.lastTriggered,
        requiredDelay: REPEAT_DELAY_MS,
        triggerCount: state.triggerCount
      })
    }

    return shouldTrigger
  }
}

/**
 * Trigger affiliate link - opens in new tab and updates state
 */
export const triggerAffiliateLink = (): void => {
  try {
    const state = getAffiliateState()

    if (!state) {
      console.warn('[Affiliate] Cannot trigger - no state found')
      return
    }

    // Open affiliate link in new tab with security flags
    const newWindow = window.open(AFFILIATE_URL, '_blank', 'noopener,noreferrer')

    if (!newWindow) {
      console.warn('[Affiliate] Popup blocked by browser')
      // Still update state even if blocked - don't retry immediately
    }

    // Update localStorage
    const now = Date.now()
    localStorage.setItem(STORAGE_KEYS.LAST_TRIGGERED, String(now))
    localStorage.setItem(STORAGE_KEYS.TRIGGER_COUNT, String(state.triggerCount + 1))

    if (import.meta.env.DEV) {
      console.log('[Affiliate] Triggered successfully:', {
        url: AFFILIATE_URL,
        triggerCount: state.triggerCount + 1,
        timestamp: now
      })
    }
  } catch (error) {
    console.error('[Affiliate] Failed to trigger:', error)
  }
}

/**
 * Get time remaining until next trigger (for debugging)
 */
export const getTimeUntilNextTrigger = (): number => {
  const state = getAffiliateState()

  if (!state) {
    return -1
  }

  const now = Date.now()

  if (state.triggerCount === 0) {
    // Time until first trigger
    const elapsed = now - state.firstVisit
    return Math.max(0, FIRST_DELAY_MS - elapsed)
  } else {
    // Time until next trigger
    const elapsed = now - state.lastTriggered
    return Math.max(0, REPEAT_DELAY_MS - elapsed)
  }
}

/**
 * Check and trigger affiliate if conditions are met
 * This is the main function to call on chapter navigation events
 *
 * @returns boolean - true if triggered, false if skipped (rate limited)
 */
export const checkAndTriggerAffiliate = (): boolean => {
  if (shouldTriggerAffiliate()) {
    triggerAffiliateLink()
    return true
  }
  return false
}

/**
 * Reset affiliate tracking (for testing/debugging)
 */
export const resetAffiliateTracking = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.FIRST_VISIT)
    localStorage.removeItem(STORAGE_KEYS.LAST_TRIGGERED)
    localStorage.removeItem(STORAGE_KEYS.TRIGGER_COUNT)

    if (import.meta.env.DEV) {
      console.log('[Affiliate] Tracking reset')
    }
  } catch (error) {
    console.warn('[Affiliate] Failed to reset:', error)
  }
}
