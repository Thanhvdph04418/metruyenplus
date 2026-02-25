import { Link } from 'react-router-dom'
import PATH from '@/utils/path'

interface SearchBreadcrumbProps {
  searchTerm: string
}

const SearchBreadcrumb = ({ searchTerm }: SearchBreadcrumbProps) => {
  return (
    <div className='mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
      <div className='flex items-center gap-2 text-black dark:text-white'>
        <Link
          to={PATH.home}
          className='flex items-center gap-1 hover:text-primary text-base sm:text-lg'
          title='Trang chủ'
        >
          Trang chủ{' '}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            aria-hidden='true'
            className='w-5 h-5'
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
        <span className='flex items-center gap-1 text-base sm:text-lg'>
          Tìm kiếm{' '}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            aria-hidden='true'
            className='w-5 h-5'
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
        </span>
        {searchTerm && (
          <span className='text-primary text-base sm:text-lg break-all'>"{searchTerm}"</span>
        )}
      </div>
    </div>
  )
}

export default SearchBreadcrumb
