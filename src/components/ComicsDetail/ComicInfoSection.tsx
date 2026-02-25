import { RatingStar } from '@/components'
import { formatCurrency } from '@/utils/formatNumber'

export interface ComicInfoSectionProps {
  title: string
  otherNames?: string[]
  authors: string
  status: 'ONGOING' | 'COMPLETED'
  totalViews: number
  totalFollows: number
  totalLikes: number
  rating: number
  lastUpdated?: string
}

/**
 * ComicInfoSection - Display comic metadata (title, authors, status, stats)
 * Pure presentational component for comic information display
 */
export const ComicInfoSection = ({
  title,
  otherNames,
  authors,
  status,
  totalViews,
  totalFollows,
  totalLikes,
  rating
}: ComicInfoSectionProps) => {
  return (
    <>
      <div className='flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-2 sm:gap-6'>
        <h1
          title={title}
          className='font-semibold text-lg sm:text-2xl text-black dark:text-white line-clamp-3 sm:line-clamp-2'
        >
          {title
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </h1>
        <RatingStar rating={rating} />
      </div>
      {otherNames && otherNames.length > 0 && (
        <p className='text-sm text-black/50 dark:text-gray-400 mt-1 italic'>
          {otherNames.join(' • ')}
        </p>
      )}

      {/* Mobile stats display */}
      <div className='sm:hidden flex flex-col gap-3 mt-3 text-black dark:text-white'>
        <div className='flex items-center gap-3'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z'
            />
          </svg>
          <span className='min-w-[90px]'>Tác giả</span>
          <span className='text-primary font-medium'>{authors}</span>
        </div>
        <div className='flex items-center gap-3'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6c0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6c0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4l-4-4v3z'
            />
          </svg>
          <span className='min-w-[90px]'>Tình trạng</span>
          <span
            className={`font-medium px-2 py-0.5 rounded text-sm ${
              status === 'ONGOING'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}
          >
            {status === 'ONGOING' ? 'Đang cập nhật' : 'Đã hoàn thành'}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z'
            />
          </svg>
          <span className='min-w-[90px]'>Lượt thích</span>
          <span className='font-medium text-[#ff6b6b]'>{formatCurrency(totalLikes)}</span>
        </div>
        <div className='flex items-center gap-3'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z'
            />
          </svg>
          <span className='min-w-[90px]'>Lượt theo dõi</span>
          <span className='font-medium text-[#64d363]'>{formatCurrency(totalFollows)}</span>
        </div>
        <div className='flex items-center gap-3'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3'
            />
          </svg>
          <span className='min-w-[90px]'>Lượt xem</span>
          <span className='font-medium text-[#4b8fd7]'>{formatCurrency(totalViews)}</span>
        </div>
      </div>

      {/* Desktop stats display */}
      <div className='hidden sm:block text-black dark:text-white'>
        <div className='flex flex-col gap-2'>
          <span className='text-base capitalize'>
            tác giả: <strong className='text-primary'>{authors}</strong>
          </span>
          <span className='text-base capitalize flex items-center gap-1'>
            tình trạng:{' '}
            <span
              className={`font-medium px-2 py-0.5 rounded text-sm ${
                status === 'ONGOING'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}
            >
              {status === 'ONGOING' ? 'Đang cập nhật' : 'Đã hoàn thành'}
            </span>
          </span>
        </div>
        <p className='flex flex-wrap items-center gap-x-6 gap-y-2 text-base mt-3'>
          <span className='flex items-center gap-1'>
            <span>Lượt xem: </span>
            <strong className='text-[#4b8fd7]'>{formatCurrency(totalViews)}</strong>
          </span>
          <span className='flex items-center gap-1'>
            <span>Theo dõi: </span>
            <strong className='text-[#64d363]'>{formatCurrency(totalFollows)}</strong>
          </span>
          <span className='flex items-center gap-1'>
            <span>Lượt thích: </span>
            <strong className='text-[#ff6b6b]'>{formatCurrency(totalLikes)}</strong>
          </span>
        </p>
      </div>
    </>
  )
}
