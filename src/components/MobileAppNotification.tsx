import { useState } from 'react'
import { useHomeComicLimit } from '@/hooks'
import { detectMobileOS, openAppStore } from '@/utils/deviceDetection'
import { trackAppDownload } from '@/utils/analytics'
import AndroidApkModal from './AndroidApkModal'

/**
 * Mobile App Notification Component
 * Shows a simple notification encouraging users to download the Tcomic mobile app
 * Only visible on mobile devices with automatic iOS/Android detection
 * For Android: Shows modal explaining APK installation
 * For iOS: Direct link to App Store
 */
const MobileAppNotification = () => {
  const { isMobile } = useHomeComicLimit()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Don't render if not mobile
  if (!isMobile) {
    return null
  }

  const mobileOS = detectMobileOS()
  const websiteUrl = import.meta.env.VITE_URL_WEBSITE || 'tcomicclub.com'
  // Extract domain name without protocol
  const domainName = websiteUrl.replace(/^https?:\/\//, '')

  const handleDownloadClick = () => {
    if (mobileOS === 'ios') {
      // Track iOS direct download
      trackAppDownload({
        platform: 'ios',
        action: 'direct_download',
        source: 'home_notification'
      })
      // iOS users go directly to App Store
      openAppStore()
    } else {
      // Track Android modal opened
      trackAppDownload({
        platform: 'android',
        action: 'modal_opened',
        source: 'home_notification'
      })
      // Android users see the modal first
      setIsModalOpen(true)
    }
  }

  const handleApkDownload = () => {
    // Track APK download
    trackAppDownload({
      platform: 'android',
      action: 'apk_download',
      source: 'home_notification'
    })
    // Download APK directly
    openAppStore()
  }

  const storeText = mobileOS === 'ios' ? 'App Store' : 'APK'

  return (
    <>
      {/* App Download Notification */}
      <div className='bg-gradient-to-r from-primary/10 to-primary-2/10 border border-primary/20 dark:border-primary-2/20 p-3 mx-4 rounded-lg mt-3 mb-2'>
        <div className='flex items-center gap-3'>
          {/* Download Icon */}
          <div className='flex-shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-primary'
            >
              <path d='M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zM6.75 15.75a.75.75 0 00-1.5 0v3a3 3 0 003 3h9a3 3 0 003-3v-3a.75.75 0 00-1.5 0v3a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-3z' />
            </svg>
          </div>
          {/* Message */}
          <div className='text-sm leading-relaxed'>
            <span className='text-primary font-medium'>
              📱 Tải app 1.1.1.1 để đọc truyện nhanh hơn
            </span>
          </div>
        </div>
      </div>


      {/* Android APK Modal */}
      <AndroidApkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleApkDownload}
      />
    </>
  )
}

export default MobileAppNotification
