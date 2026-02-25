import React from 'react'

interface AdNoticeProps {
  className?: string
}

/**
 * AdNotice - Permanent friendly notification about ads on the site
 *
 * Features:
 * - Clean, professional design
 * - Always visible (non-dismissible)
 * - Dark/Light mode support
 * - Responsive for mobile and desktop
 * - Compact 2-line format with bordered container
 */
const AdNotice: React.FC<AdNoticeProps> = ({ className = '' }) => {
  return (
    <div className={`w-full py-4 ${className}`}>
      <div className='container max-w-2xl px-4'>
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg py-3 px-4'>
          <div className='flex items-center gap-3'>
            {/* Icon */}
            <div className='flex-shrink-0'>
              <span className='text-xl'>💙</span>
            </div>

            {/* Text content - 2 lines only */}
            <div className='flex-1 text-xs sm:text-sm space-y-0.5'>
              <p className='text-blue-900 dark:text-blue-100 font-medium leading-snug'>
                Chúng mình xin phép đặt quảng cáo để duy trì server và phát triển web.
              </p>
              <p className='text-blue-800 dark:text-blue-200 leading-snug'>
                <span className='inline-flex items-center gap-1'>
                  <span>✨</span>
                  <strong>Cam kết:</strong> 100% không có quảng cáo bẩn hay độc hại. ❤️
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdNotice
