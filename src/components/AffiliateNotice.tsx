/**
 * AffiliateNotice Component
 *
 * Compact but prominent design for ComicsDetail page
 * Positioned between description and chapter list
 *
 * Features:
 * - Small, compact size
 * - Eye-catching link design to encourage clicks
 * - Support for dark/light mode
 * - Responsive design
 * - Google Analytics tracking for affiliate clicks
 * - Supports both static and API affiliate modes
 */

import { useState } from 'react'
import { trackAffiliateClick } from '@/utils/analytics'
import { getAffiliateLink, getStaticAffiliateUrl, getAffiliateMode } from '@/utils/affiliate'

const AffiliateNotice = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkClick = async () => {
    if (isLoading) return

    const mode = getAffiliateMode()

    if (mode === 'api') {
      // API mode: fetch link first
      setIsLoading(true)
      try {
        const affiliateUrl = await getAffiliateLink()

        if (affiliateUrl) {
          // Track affiliate link click
          trackAffiliateClick({
            action: 'affiliate_link_click',
            source: 'comicsdetail_page',
            url: affiliateUrl
          })

          window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
        } else {
          console.warn('[AffiliateNotice] No affiliate link available')
        }
      } catch (error) {
        console.error('[AffiliateNotice] Failed to get affiliate link:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Static mode: use static URL directly
      const staticUrl = getStaticAffiliateUrl()

      trackAffiliateClick({
        action: 'affiliate_link_click',
        source: 'comicsdetail_page',
        url: staticUrl
      })

      window.open(staticUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className='bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-amber-900/40 border border-amber-200/80 dark:border-amber-600/60 rounded-lg shadow-md'>
      <div className='px-3 sm:px-4 py-2.5 sm:py-3'>
        <div className='flex items-center justify-center gap-2 flex-wrap'>
          <span className='text-xs sm:text-sm text-gray-700 dark:text-gray-200'>
            💙 <span className='font-medium'>nettruyen không có quảng cáo!</span> Hãy
          </span>
          <button
            onClick={handleLinkClick}
            disabled={isLoading}
            className='group inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 disabled:cursor-wait text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100 transition-all duration-200 text-xs sm:text-sm'
            title='Click để hỗ trợ nettruyen'
          >
            {isLoading ? (
              <svg
                className='w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            ) : (
              <svg
                className='w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            <span className='group-hover:tracking-wide transition-all duration-200'>
              {isLoading ? 'ĐANG TẢI...' : 'CLICK VÀO ĐÂY'}
            </span>
            {!isLoading && (
              <svg
                className='w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>
          <span className='text-xs sm:text-sm text-gray-700 dark:text-gray-200'>
            trước khi mua hàng Shopee để hỗ trợ bọn mình duy trì cộng đồng truyện miễn phí ✨
          </span>
        </div>
      </div>
    </div>
  )
}

export default AffiliateNotice
