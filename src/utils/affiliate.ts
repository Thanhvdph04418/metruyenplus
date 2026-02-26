/**
 * Affiliate Link Trigger System
 *
 * Opens affiliate link on chapter navigation with rate limiting:
 * - First chapter change: After 15 minutes from first visit (configurable)
 * - Subsequent changes: After 1 hour from last trigger (configurable)
 *
 * Supports two modes (configurable via VITE_AFFILIATE_MODE):
 * - 'static': Uses static VITE_AFFILIATE_URL
 * - 'api': Fetches link from API with browserSessionId
 *
 * Trigger is event-driven (on user chapter navigation), not timer-based.
 */

import axios from 'axios'

const axiosClients = axios.create({
  baseURL: import.meta.env.AFFILIATE_API_URL || 'https://cm.mediaone.dev',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  responseType: 'json'
})

// Environment configuration with defaults
const AFFILIATE_ENABLED = import.meta.env.VITE_AFFILIATE_ENABLED !== 'false' // default: true
const AFFILIATE_MODE = (import.meta.env.VITE_AFFILIATE_MODE as 'static' | 'api') || 'static'
const AFFILIATE_URL = import.meta.env.VITE_AFFILIATE_URL || 'https://comic-aff.vercel.app'
const AFFILIATE_NETWORK = import.meta.env.VITE_AFFILIATE_NETWORK || 'SHOPEE'
const FIRST_DELAY_MS = Number(import.meta.env.VITE_AFFILIATE_FIRST_DELAY_MS) || 900000 // 15 minutes
const REPEAT_DELAY_MS = Number(import.meta.env.VITE_AFFILIATE_REPEAT_DELAY_MS) || 3600000 // 1 hour

// localStorage keys
const STORAGE_KEYS = {
  FIRST_VISIT: 'affiliate_first_visit',
  LAST_TRIGGERED: 'affiliate_last_triggered',
  TRIGGER_COUNT: 'affiliate_trigger_count',
  BROWSER_SESSION_ID: 'affiliate_browser_session_id'
} as const

// Type definitions
interface AffiliateState {
  firstVisit: number
  lastTriggered: number
  triggerCount: number
}

interface AffiliateApiResponse {
  code: number
  data: {
    affiliateId: number
    name: string
    affiliateLink: string
    urlImage: string
    network: string
  } | null
  message: string
}

/**
 * Generate a UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Get or create browser session ID
 * Persisted in localStorage for consistent identification
 */
export const getBrowserSessionId = (): string => {
  try {
    let sessionId = localStorage.getItem(STORAGE_KEYS.BROWSER_SESSION_ID)

    if (!sessionId) {
      sessionId = generateUUID()
      localStorage.setItem(STORAGE_KEYS.BROWSER_SESSION_ID, sessionId)

      if (import.meta.env.DEV) {
        console.log('[Affiliate] Generated new browserSessionId:', sessionId)
      }
    }

    return sessionId
  } catch (error) {
    console.warn('[Affiliate] localStorage unavailable, generating temporary ID:', error)
    return generateUUID()
  }
}

/**
 * Initialize affiliate tracking on first visit
 * Sets up first_visit timestamp if it doesn't exist
 */
export const initializeAffiliateTracking = (): void => {
  if (!AFFILIATE_ENABLED) {
    if (import.meta.env.DEV) {
      console.log('[Affiliate] Tracking disabled via VITE_AFFILIATE_ENABLED')
    }
    return
  }

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
          repeatDelay: REPEAT_DELAY_MS,
          mode: AFFILIATE_MODE,
          enabled: AFFILIATE_ENABLED
        })
      }
    }

    // Ensure browserSessionId exists
    getBrowserSessionId()
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
  if (!AFFILIATE_ENABLED) {
    return false
  }

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
 * Fetch affiliate link from API
 * @returns affiliate link URL or null if failed
 */
export const fetchAffiliateLinkFromAPI = async (): Promise<string | null> => {
  try {
    const browserSessionId = getBrowserSessionId()

    const response = await axiosClients.get<AffiliateApiResponse>('/api/app/affiliate/link', {
      params: {
        browserSessionId,
        network: AFFILIATE_NETWORK
      }
    })

    if (response.data.code === 0 && response.data.data?.affiliateLink) {
      if (import.meta.env.DEV) {
        console.log('[Affiliate] API response:', {
          name: response.data.data.name,
          network: response.data.data.network,
          link: response.data.data.affiliateLink
        })
      }
      return response.data.data.affiliateLink
    }

    if (import.meta.env.DEV) {
      console.log('[Affiliate] API returned no link:', response.data.message)
    }
    return null
  } catch (error) {
    console.warn('[Affiliate] API call failed:', error)
    return null
  }
}

/**
 * Update localStorage state after trigger
 */
const updateTriggerState = (state: AffiliateState): void => {
  const now = Date.now()
  localStorage.setItem(STORAGE_KEYS.LAST_TRIGGERED, String(now))
  localStorage.setItem(STORAGE_KEYS.TRIGGER_COUNT, String(state.triggerCount + 1))

  if (import.meta.env.DEV) {
    console.log('[Affiliate] State updated:', {
      triggerCount: state.triggerCount + 1,
      timestamp: now
    })
  }
}

/**
 * Trigger affiliate link - opens in new tab and updates state
 * Supports both static and API modes
 */
export const triggerAffiliateLink = async (): Promise<void> => {
  if (!AFFILIATE_ENABLED) {
    if (import.meta.env.DEV) {
      console.log('[Affiliate] Trigger skipped - disabled')
    }
    return
  }

  try {
    const state = getAffiliateState()

    if (!state) {
      console.warn('[Affiliate] Cannot trigger - no state found')
      return
    }

    let affiliateUrl: string

    if (AFFILIATE_MODE === 'api') {
      // API mode: fetch link from server
      const apiUrl = await fetchAffiliateLinkFromAPI()
      console.log('apiUrl', apiUrl)
      if (!apiUrl) {
        // API failed or no link available - fail silently (no fallback)
        if (import.meta.env.DEV) {
          console.log('[Affiliate] API mode - no link available, skipping')
        }
        return
      }
      affiliateUrl = apiUrl
    } else {
      // Static mode: use configured URL
      affiliateUrl = AFFILIATE_URL
    }

    // Open affiliate link in new tab with security flags
    const newWindow = window.open(affiliateUrl, '_blank', 'noopener,noreferrer')

    if (!newWindow) {
      console.warn('[Affiliate] Popup blocked by browser')
      // Still update state even if blocked - don't retry immediately
    }

    // Update localStorage
    updateTriggerState(state)

    if (import.meta.env.DEV) {
      console.log('[Affiliate] Triggered successfully:', {
        mode: AFFILIATE_MODE,
        url: affiliateUrl,
        triggerCount: state.triggerCount + 1
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
 * Note: This function is async but the popup opens synchronously
 * with user action to avoid popup blockers (for static mode).
 * For API mode, there may be a slight delay.
 *
 * @returns Promise<boolean> - true if triggered, false if skipped (rate limited or disabled)
 */
export const checkAndTriggerAffiliate = async (): Promise<boolean> => {
  console.log('checkAndTriggerAffiliate', {
    AFFILIATE_ENABLED
  })
  if (!AFFILIATE_ENABLED) {
    return false
  }
  const shouldTrigger = shouldTriggerAffiliate()
  if (shouldTrigger) {
    await triggerAffiliateLink()
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
    // Note: browserSessionId is NOT removed - it should persist

    if (import.meta.env.DEV) {
      console.log('[Affiliate] Tracking reset')
    }
  } catch (error) {
    console.warn('[Affiliate] Failed to reset:', error)
  }
}

/**
 * Get current affiliate configuration (for debugging)
 */
export const getAffiliateConfig = () => ({
  enabled: AFFILIATE_ENABLED,
  mode: AFFILIATE_MODE,
  network: AFFILIATE_NETWORK,
  staticUrl: AFFILIATE_URL,
  firstDelayMs: FIRST_DELAY_MS,
  repeatDelayMs: REPEAT_DELAY_MS,
  browserSessionId: getBrowserSessionId()
})

/**
 * Get affiliate link based on current mode
 * For use in components that need to display/open affiliate links
 *
 * @returns Promise<string | null> - affiliate link URL or null if unavailable
 */
export const getAffiliateLink = async (): Promise<string | null> => {
  if (AFFILIATE_MODE === 'api') {
    return await fetchAffiliateLinkFromAPI()
  }

  return AFFILIATE_URL
}

/**
 * Check if affiliate system is enabled
 */
export const isAffiliateEnabled = (): boolean => {
  return AFFILIATE_ENABLED
}

/**
 * Get static affiliate URL (for fallback or display purposes)
 */
export const getStaticAffiliateUrl = (): string => {
  return AFFILIATE_URL
}

/**
 * Get current affiliate mode
 */
export const getAffiliateMode = (): 'static' | 'api' => {
  return AFFILIATE_MODE
}
