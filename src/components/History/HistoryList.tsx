import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import imgError from '/img-error.webp'
import { HistoryComic } from '@/utils/history'

interface HistoryListProps {
  items: HistoryComic[]
  onDelete: (id: string) => void
  isLoading: boolean
}

const HistoryList = ({ items, onDelete, isLoading }: HistoryListProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 lg:gap-6`}>
      {items.map((item) => (
        <div
          key={item.id}
          className='col-span-1 sm:col-span-12 md:col-span-6 p-2 sm:p-3 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] rounded-lg'
        >
          <div className='flex text-black dark:text-white'>
            <Link
              to={`${PATH.comics}/${item.slug_comic}-${item.id}`}
              title={item.title}
              className='flex-shrink-0'
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                title={item.title}
                loading='lazy'
                className='w-[100px] sm:w-[140px] h-[133px] sm:h-[186px] object-cover rounded-md'
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = imgError
                }}
              />
            </Link>
            <div className='pl-3 sm:pl-4 flex flex-col flex-1'>
              <Link
                to={`${PATH.comics}/${item.slug_comic}-${item.id}`}
                className='text-sm sm:text-base text-black hover:text-primary dark:text-white dark:hover:text-primary font-bold leading-tight line-clamp-2'
                title={item.title}
              >
                {item.title}
              </Link>
              <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2'>
                {item.time}
              </span>
              <p className='mt-2 sm:mt-3'>
                <Link
                  to={`${PATH.comics}/${item.slug_comic}-${item.id}/${item.slug_chapter}/${item.chapter_id}`}
                  title={item.last_reading}
                  className='text-sm sm:text-base text-primary hover:text-primary/80'
                >
                  {item.last_reading}
                </Link>
              </p>
              <div className='flex gap-2 mt-auto pt-2 sm:pt-4'>
                <Link
                  title={item.last_reading}
                  to={`${PATH.comics}/${item.slug_comic}-${item.id}/${item.slug_chapter}/${item.chapter_id}`}
                  className='flex-1 text-sm sm:text-base bg-[#4b8fd7] hover:bg-[#4b8fd7]/90 text-white rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-center active:scale-95 transition-transform'
                >
                  Đọc tiếp
                </Link>
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={isLoading}
                  className='flex-1 text-sm sm:text-base border-primary hover:bg-primary/10 rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-center border text-primary active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
