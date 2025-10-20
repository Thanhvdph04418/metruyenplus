import { Link } from 'react-router-dom'
import { HistoryComic } from '@/utils/history'
import PATH from '@/utils/path'
import imgError from '/img-error.webp'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface HistoryDesktopProps {
  dataComics: HistoryComic[]
}

const HistoryDesktop = ({ dataComics }: HistoryDesktopProps) => {
  const displayData = dataComics.slice(0, 8)
  return (
    <div className='hidden xl:block'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <h2 className='capitalize font-semibold text-2xl text-gray-900 dark:text-white leading-5'>
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
      <div className='flex gap-4 overflow-x-auto pb-2 hide-horizontal-scrollbar'>
        {displayData.map((comic) => (
          <div key={comic.id} className='flex-shrink-0 w-[180px]'>
            <div className='w-full h-[200px] overflow-hidden rounded-md'>
              <Link
                to={`${PATH.comics}/${comic.slug_comic}-${comic.id}`}
                title={comic.title}
                className='group block w-full h-full'
              >
                <LazyLoadImage
                  src={comic.thumbnail}
                  title={comic.title}
                  alt={comic.title}
                  width='100%'
                  height='100%'
                  placeholderSrc={imgError}
                  threshold={100}
                  wrapperClassName='w-full h-full block'
                  className='w-full h-full object-cover group-hover:scale-[1.15] transition-all duration-300'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = imgError
                  }}
                />
              </Link>
            </div>
            <div className='mt-3 flex flex-col text-gray-900 dark:text-white'>
              <Link
                to={`${PATH.comics}/${comic.slug_comic}-${comic.id}`}
                title={comic.title}
                className='hover:text-primary font-semibold text-sm leading-4 line-clamp-2 min-h-[2rem]'
              >
                {comic.title}
              </Link>
              <span className='text-sm text-gray-500 dark:text-gray-400 mt-2'>{comic.time}</span>
              <Link
                to={`${PATH.comics}/${comic.slug_comic}-${comic.id}/${comic.slug_chapter}/${comic.chapter_id}`}
                title={comic.last_reading}
                className='text-primary text-sm truncate mt-1'
              >
                {comic.last_reading}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryDesktop
