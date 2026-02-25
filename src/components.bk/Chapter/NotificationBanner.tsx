import { useState } from 'react'

const NotificationBanner = () => {
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className='bg-white dark:bg-gray-800 p-3 sm:p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700'>
      <button onClick={() => setIsMuted(!isMuted)} className='flex-shrink-0 relative group'>
        {isMuted ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5 text-red-500 cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5 text-red-500 cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z'
            >
              <animate
                attributeName='opacity'
                values='0.3;1;0.3'
                dur='2s'
                repeatCount='indefinite'
              />
              <animate
                attributeName='strokeWidth'
                values='1;2;1'
                dur='2s'
                repeatCount='indefinite'
              />
            </path>
          </svg>
        )}
      </button>
      <span className='text-[10px] xs:text-xs sm:text-sm text-gray-800 dark:text-gray-200'>
        Nếu web/ảnh load chậm,{' '}
        <a
          href='https://1.1.1.1'
          target='_blank'
          rel='noopener noreferrer'
          className='font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors'
        >
          TẢI NGAY ứng dụng VPN (1.1.1.1)
        </a>{' '}
        tại đây để cải thiện tốc độ.
      </span>
    </div>
  )
}

export default NotificationBanner
