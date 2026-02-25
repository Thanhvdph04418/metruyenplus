import { Link } from 'react-router-dom'
import PATH from '@/utils/path'

interface HistoryActionsProps {
  onSync: () => void
  onDeleteAll: () => void
  isSyncing: boolean
  hasItems: boolean
}

const HistoryActions = ({ onSync, onDeleteAll, isSyncing, hasItems }: HistoryActionsProps) => {
  const hasAuthToken = !!localStorage.getItem('auth_token')

  const handleDeleteAll = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa tất cả lịch sử không?')
    if (confirmed) {
      onDeleteAll()
    }
  }

  return (
    <div className='mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between text-black dark:text-white'>
      <div className='flex items-center gap-2'>
        <Link
          to={PATH.home}
          className='flex items-center gap-1 hover:text-primary text-base sm:text-lg'
        >
          Trang chủ{' '}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            aria-hidden='true'
            className='w-4 h-4 sm:w-5 sm:h-5'
            viewBox='0 0 48 48'
          >
            <path
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M19 12L31 24L19 36'
            />
          </svg>
        </Link>
        <span className='flex items-center gap-1 text-base sm:text-lg'>Lịch sử</span>
      </div>
      <div className='flex flex-wrap sm:flex-nowrap items-center gap-2'>
        {hasAuthToken && (
          <button
            onClick={onSync}
            disabled={isSyncing}
            className='flex-1 sm:flex-none text-sm sm:text-base active:scale-90 border border-gray-500 dark:border-gray-400 
              hover:bg-primary hover:text-white hover:border-primary 
              dark:hover:bg-primary dark:hover:text-white dark:hover:border-primary 
              transition-colors duration-200 
              px-3 py-1.5 sm:py-1 rounded-md flex items-center justify-center gap-1.5'
          >
            {isSyncing ? (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3' />
              </svg>
            )}
            <span className='sm:hidden'>Đồng bộ</span>
            <span className='hidden sm:inline'>Đồng bộ với app TComic</span>
          </button>
        )}
        <button
          onClick={handleDeleteAll}
          disabled={!hasItems}
          className='flex-1 sm:flex-none text-sm sm:text-base active:scale-90 border border-gray-500 dark:border-gray-400 
            hover:bg-primary hover:text-white hover:border-primary 
            dark:hover:bg-primary dark:hover:text-white dark:hover:border-primary 
            transition-colors duration-200 
            px-3 py-1.5 sm:py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Xóa tất cả
        </button>
      </div>
    </div>
  )
}

export default HistoryActions
