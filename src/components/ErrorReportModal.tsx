import { useState } from 'react'
import comicApis from '../apis/comicApis'

const ErrorReportModal = ({
  isOpen,
  onClose,
  comicId,
  chapterId
}: {
  isOpen: boolean
  onClose: (wasSubmitted?: boolean) => void
  comicId: number
  chapterId: number
}) => {
  const [selectedError, setSelectedError] = useState('Ảnh lỗi, không thấy ảnh')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await comicApis.reportErrorChapterComic({
        comicId,
        chapterId,
        title: selectedError,
        description
      })
      onClose(true)
    } catch (error) {
      console.error('Error submitting report:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-xl w-full max-w-md'>
        {/* Header */}
        <div className='flex items-center justify-between p-3 border-b dark:border-gray-700'>
          <h2 className='text-base font-medium text-gray-900 dark:text-white'>Báo lỗi truyện</h2>
          <button
            onClick={() => onClose()}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-3'>
          <div className='mb-3'>
            <p className='text-sm text-gray-700 dark:text-gray-200'>
              Cảm ơn bạn đã hỗ trợ báo lỗi, truyện sẽ được fix trong thời gian sớm nhất.
            </p>
          </div>

          {/* Error Type Selection */}
          <div className='mb-3'>
            <select
              value={selectedError}
              onChange={(e) => setSelectedError(e.target.value)}
              className='w-full p-2 text-sm border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none'
            >
              <option value='Ảnh lỗi, không thấy ảnh'>Ảnh lỗi, không thấy ảnh</option>
              <option value='Ảnh tải lâu'>Ảnh tải lâu</option>
              <option value='Lỗi toàn bộ ảnh'>Lỗi toàn bộ ảnh</option>
              <option value='Lỗi khác'>Lỗi khác</option>
            </select>
          </div>

          {/* Description */}
          <div className='mb-3'>
            <p className='text-xs text-red-500 dark:text-red-400 mb-1'>
              Ảnh tải lâu hay lỗi toàn bộ ảnh?
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Mô tả chi tiết lỗi sẽ được ưu tiên FIX nhanh hơn'
              className='w-full p-2 text-sm border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20'
              maxLength={300}
            />
            <div className='text-right text-xs text-gray-500 dark:text-gray-400'>
              {description.length}/300
            </div>
          </div>

          {/* Buttons */}
          <div className='flex gap-2 mt-4'>
            <button
              type='button'
              onClick={() => onClose()}
              className='flex-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors'
            >
              Đóng lại
            </button>
            <button
              type='submit'
              className='flex-1 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors'
            >
              Gửi đi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ErrorReportModal
