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
 */

import { trackAffiliateClick } from '@/utils/analytics'

const AFFILIATE_URL = import.meta.env.VITE_AFFILIATE_URL || 'https://comic-aff.vercel.app'

const AffiliateNotice = () => {
  const handleLinkClick = () => {
    // Track affiliate link click before opening
    trackAffiliateClick({
      action: 'affiliate_link_click',
      source: 'comicsdetail_page',
      url: AFFILIATE_URL
    })

    window.open(AFFILIATE_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-amber-900/40 border border-amber-200/80 dark:border-amber-600/60 rounded-xl shadow-md'>
      <div className='px-3 sm:px-4 py-2.5 sm:py-3'>
        <div className='flex items-center justify-center gap-2 flex-wrap'>
          <span className='text-xs sm:text-sm text-gray-700 dark:text-gray-200'>
            💙 <span className='font-medium'>MeTruyen+ không có quảng cáo!</span> Hãy
          </span>
          <button
            onClick={handleLinkClick}
            className='group inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-xs sm:text-sm'
            title='Click để hỗ trợ MeTruyen+'
          >
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
            <span className='group-hover:tracking-wide transition-all duration-200'>
              CLICK VÀO ĐÂY
            </span>
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
