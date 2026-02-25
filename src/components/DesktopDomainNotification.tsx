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
  const websiteUrl = import.meta.env.VITE_URL_WEBSITE || 'tcomicfanq.com'
  // Extract domain name without protocol
  const domainName = websiteUrl.replace(/^https?:\/\//, '')

  return (
    <div className='hidden md:block w-full bg-white dark:bg-gray-900 border-y border-red-200 dark:border-red-900'>
      <div className='container px-4 xl:px-0 mx-auto py-3'>
        <div className='flex items-center justify-center gap-3'>
    
          <div className='flex-shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-gray-700 dark:text-gray-300'
            >
              <path d='M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z' />
              <path d='M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z' />
            </svg>
          </div>


          <div className='text-sm'>
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
    </div>
  )
}

export default DesktopDomainNotification
