/**
 * Mobile OS detection and app store URL utilities
 */

export type MobileOS = 'ios' | 'android' | 'unknown'

export interface AppStoreUrls {
  ios: string
  android: string
}

/**
 * App store URLs for TComic mobile app
 */
export const TCOMIC_APP_URLS: AppStoreUrls = {
  ios: 'https://apps.apple.com/vn/app/tcomic-truy%E1%BB%87n-tranh-t%E1%BB%95ng-h%E1%BB%A3p/id1592247388',
  android: 'https://s3.ap-southeast-1.wasabisys.com/imgcdn.tcomic.top/tcomic.apk' // Direct APK download
}

/**
 * Detect mobile operating system from user agent
 * @returns The detected mobile OS type
 */
export const detectMobileOS = (): MobileOS => {
  if (typeof window === 'undefined') {
    return 'unknown' // Server-side rendering fallback
  }

  const userAgent = window.navigator.userAgent.toLowerCase()

  // iOS detection - check for iPhone, iPad, iPod
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  }

  // Android detection
  if (/android/.test(userAgent)) {
    return 'android'
  }

  return 'unknown'
}

/**
 * Get the appropriate app store URL for the current device
 * @returns App store URL for the detected OS, defaults to Android Play Store
 */
export const getAppStoreUrl = (): string => {
  const os = detectMobileOS()

  switch (os) {
    case 'ios':
      return TCOMIC_APP_URLS.ios
    case 'android':
      return TCOMIC_APP_URLS.android
    default:
      // Default to Android Play Store for unknown devices
      return TCOMIC_APP_URLS.android
  }
}

/**
 * Open app store URL in a new tab
 * @param customUrl Optional custom URL to open instead of detected one
 */
export const openAppStore = (customUrl?: string): void => {
  const url = customUrl || getAppStoreUrl()
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Check if current device is a mobile device
 * Note: This is a basic check, consider using the existing useHomeComicLimit hook for better accuracy
 * @returns True if device appears to be mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
}
