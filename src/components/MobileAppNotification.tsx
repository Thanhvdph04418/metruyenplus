import { useState } from 'react'
import { useHomeComicLimit } from '@/hooks'
import { detectMobileOS, openAppStore } from '@/utils/deviceDetection'
import { trackAppDownload } from '@/utils/analytics'
import AndroidApkModal from './AndroidApkModal'

/**
 * Mobile App Notification Component
 * Shows a simple notification encouraging users to download the nettruyen mobile app
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
  const websiteUrl = import.meta.env.VITE_URL_WEBSITE || 'nettruyenfanq.com'
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
      {/* Domain Migration Notification */}
      <div className='bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900 p-2.5 mx-4 rounded-md mt-3 mb-2'>
        <div className='flex items-start gap-2'>
          {/* Speaker Icon */}
          <div className='flex-shrink-0 mt-0.5'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5 text-gray-700 dark:text-gray-300'
            >
              <path d='M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z' />
              <path d='M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z' />
            </svg>
          </div>
          {/* Message */}
          <div className='text-xs leading-relaxed'>
            <span className='text-red-600 dark:text-red-400'>
              ★ Truy cập website mới{' '}
              <a
                href={websiteUrl}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = websiteUrl
                }}
                className='font-bold underline hover:text-red-700 dark:hover:text-red-300 cursor-pointer transition-colors'
              >
                {domainName}
              </a>{' '}
              để đọc truyện bình thường anh em nhé!
            </span>
          </div>
        </div>
      </div>

      {/* App Download Notification */}
      <div className='bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-highlight text-gray-800 dark:text-gray-200 p-2 mx-4 rounded-md mb-2 text-center'>
        <div className='text-xs'>
          <div className='mb-1'>Bạn hãy tải app nettruyen nếu website không thể truy cập</div>
          <span
            onClick={handleDownloadClick}
            className='text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 underline font-medium'
          >
            Tải {mobileOS === 'ios' ? 'từ' : 'file'} {storeText}
          </span>
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
