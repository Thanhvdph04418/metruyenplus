import { Link } from 'react-router-dom'
import { HistoryComic } from '@/utils/history'
import PATH from '@/utils/path'
import imgError from '/img-error.webp'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface HistoryMobileProps {
  dataComics: HistoryComic[]
}

// Calculate how many items fit in one row based on screen width
const getItemsPerRow = () => {
  if (typeof window === 'undefined') return 4
  const width = window.innerWidth
  if (width >= 768) return 8 // md
  if (width >= 640) return 7 // sm
  if (width >= 480) return 6 // min-[480px]
  if (width >= 375) return 5 // min-[375px]
  return 4 // default
}

const HistoryMobile = ({ dataComics }: HistoryMobileProps) => {
  // Limit data to fit in one row
  const itemsPerRow = getItemsPerRow()
  const displayData = dataComics.slice(0, itemsPerRow)

  return (
    <div className='block xl:hidden'>
      <div className='flex items-center justify-between mb-6 px-2'>
        <div className='flex items-center gap-2 lg:gap-4'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white min-h-[28px]'>
            Lịch sử đọc
          </h2>
        </div>
        <Link
          to={PATH.history}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary-2/10 hover:from-primary/20 hover:to-primary-2/20 rounded-xl text-sm font-medium text-primary dark:text-primary-2 transition-all duration-300 hover:scale-105'
        >
          <span>Xem tất cả</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </Link>
      </div>
      <div className='flex gap-3 overflow-x-auto pb-2 hide-horizontal-scrollbar'>
        {displayData.map((comic) => (
          <div key={comic.id} className='flex-shrink-0 w-[120px]'>
            <div className='w-full h-[150px] overflow-hidden rounded-md'>
              <Link
                to={`${PATH.comics}/${comic.slug_comic}-${comic.id}`}
                title={comic.title}
                className='group block w-full h-full'
              >
                <LazyLoadImage
                  src={comic.thumbnail}
                  title={comic.title}
                  alt={comic.title}
                  loading='lazy'
                  decoding='async'
                  effect='blur'
                  width='100%'
                  height='100%'
                  placeholderSrc={imgError}
                  threshold={100}
                  wrapperClassName='w-full h-full block'
                  className='w-full h-full object-cover group-hover:scale-[1.05] transition-all duration-300'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = imgError
                  }}
                />
              </Link>
            </div>
            <div className='mt-2'>
              <Link
                to={`${PATH.comics}/${comic.slug_comic}-${comic.id}`}
                title={comic.title}
                className='hover:text-primary font-semibold text-sm leading-4 line-clamp-2 block text-gray-900 dark:text-white'
              >
                {comic.title}
              </Link>
              <span className='text-xs text-gray-500 dark:text-gray-400 mt-1 block'>{comic.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryMobile
