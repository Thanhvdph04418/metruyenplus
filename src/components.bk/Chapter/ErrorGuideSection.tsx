import { useState } from 'react'
import ErrorReportModal from '@/components/ErrorReportModal'
import { ErrorGuideSectionProps } from './types'

const ErrorGuideSection = ({ comicId, chapterId }: ErrorGuideSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleModalClose = (wasSubmitted: boolean = false) => {
    setIsModalOpen(false)
    if (wasSubmitted) {
      setShowThankYou(true)
      // Hide thank you message after 5 seconds
      setTimeout(() => setShowThankYou(false), 5000)
    }
  }

  return (
    <div className='bg-blue-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700'>
      <div className='container max-w-2xl mx-auto px-3 sm:px-4 lg:px-0'>
        <div className='flex flex-col items-center py-2'>
          {/* Error button */}
          <div className='flex items-center justify-center'>
            {showThankYou ? (
              <div className='w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='font-medium text-sm'>
                  Cảm ơn bạn đã báo cáo! Chúng tôi sẽ khắc phục sớm nhất.
                </span>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className='w-full sm:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
                  />
                </svg>
                <span className='font-medium text-sm'>Báo lỗi</span>
              </button>
            )}
          </div>

          {/* Guide text */}
          <div className='flex items-center justify-center gap-2 mt-2 bg-blue-50/50 dark:bg-gray-800/50 py-3 sm:py-4 px-4 rounded-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5 text-blue-500 flex-shrink-0'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
              />
            </svg>
            <p className='text-[10px] xs:text-xs sm:text-sm'>
              <span className='text-gray-500 dark:text-gray-400'>Sử dụng</span>
              <span className='mx-1 font-medium text-blue-600 dark:text-blue-400'>
                mũi tên trái (←) hoặc phải (→)
              </span>
              <span className='text-gray-500 dark:text-gray-400'>để chuyển chapter</span>
            </p>
          </div>
        </div>
      </div>

      <ErrorReportModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        comicId={comicId}
        chapterId={chapterId}
      />
    </div>
  )
}

export default ErrorGuideSection
