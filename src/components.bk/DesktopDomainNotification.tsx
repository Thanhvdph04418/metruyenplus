import React from 'react'

/**
 * DesktopDomainNotification Component
 * Displays a permanent notification about the website domain for desktop users
 * Features:
 * - Always visible on desktop (hidden on mobile)
 * - Non-dismissible permanent notification
 * - Domain pulled from VITE_URL_WEBSITE environment variable
 * - Dark/Light mode support
 * - Red text for emphasis matching mobile notification style
 */
const DesktopDomainNotification: React.FC = () => {
  // const websiteUrl = import.meta.env.VITE_URL_WEBSITE || 'tcomicclub.com'
  // Extract domain name without protocol
  // const domainName = websiteUrl.replace(/^https?:\/\//, '')

  return (
    <div className='hidden md:block w-full bg-gradient-to-r from-primary/10 to-primary-2/10 border-y border-primary/20 dark:border-primary-2/20'>
      <div className='container px-4 xl:px-0 mx-auto py-3'>
        <div className='flex items-center justify-center gap-3'>
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
          <div className='text-sm'>
            <span className='text-primary font-medium'>
              📱 Tải app 1.1.1.1 để đọc truyện nhanh hơn
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopDomainNotification
