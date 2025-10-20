import React, { useEffect, useState } from 'react'

interface AdSocialBarProps {
  className?: string
}

/**
 * AdSocialBar - Adsterra Social Bar Ad Format
 *
 * Based on Adsterra's Social Bar monetization format which:
 * - Appears as friendly notifications, icons, or widgets
 * - Works on all browsers and OS without subscriptions
 * - Doesn't block web content (uses dynamic iFrame technology)
 * - Returns high CPM rates with outstanding CTRs
 * - Is ad-blocker friendly due to lightweight code
 *
 * Frequency Capping: Shows ad on alternating chapter views
 * - Chapter 1: Show ad
 * - Chapter 2: No ad
 * - Chapter 3: Show ad
 * - And so on...
 *
 * Reference: https://adsterra.com/blog/publishers-guide-to-social-bar/
 */
const AdSocialBar: React.FC<AdSocialBarProps> = ({ className = '' }) => {
  const [shouldShowAd, setShouldShowAd] = useState<boolean>(false)

  useEffect(() => {
    // Get current chapter visit count from localStorage
    const STORAGE_KEY = 'adsterra_social_bar_counter'
    const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)

    // Show ad on odd visits (1st, 3rd, 5th, etc.)
    // Hide ad on even visits (2nd, 4th, 6th, etc.)
    const showAd = currentCount % 2 === 0

    setShouldShowAd(showAd)

    // Increment counter for next visit
    localStorage.setItem(STORAGE_KEY, String(currentCount + 1))

    // Only load ad script if we should show the ad
    if (!showAd) {
      return
    }

    // Create the ad script element
    const adScript = document.createElement('script')
    adScript.type = 'text/javascript'
    adScript.src = '//pl27751885.revenuecpmgate.com/62/f4/fd/62f4fdd2be3fa2e6325497e682da8cfb.js'
    adScript.async = true

    // Append script to document body (as per Adsterra documentation)
    document.body.appendChild(adScript)

    // Cleanup function to remove script when component unmounts
    return () => {
      if (adScript && adScript.parentNode) {
        adScript.parentNode.removeChild(adScript)
      }
    }
  }, [])

  // Don't render anything if ad shouldn't be shown
  if (!shouldShowAd) {
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Social Bar container - the ad will be injected by the script */}
      {/* No visible placeholder needed as Social Bar appears as overlay notifications/widgets */}
      <div id='adsterra-social-bar' className='relative' />
    </div>
  )
}

export default AdSocialBar
