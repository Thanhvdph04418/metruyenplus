import { CardItem } from '@/components'
import { comics } from '@/types/data'

interface ComicsGridProps {
  comics: comics[]
  isLoading: boolean
  emptyMessage?: string
}

const ComicsGrid = ({ comics, isLoading, emptyMessage }: ComicsGridProps) => {
  if (isLoading) {
    return (
      <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 xl:gap-4'>
        {Array(18)
          .fill(0)
          .map((_, i) => (
            <li
              key={i}
              className='w-full min-h-[280px] sm:min-h-[320px] overflow-hidden animate-pulse rounded-lg bg-white dark:bg-gray-900 shadow-md p-2'
            >
              <div className='flex items-center justify-center w-full h-[200px] sm:h-[240px] lg:h-[220px] bg-gray-200 dark:bg-gray-700 flex-shrink-0 rounded-lg'>
                <svg
                  className='w-16 h-16 text-gray-200 dark:text-gray-600'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                </svg>
              </div>
              <div className='mt-2 sm:mt-3 flex flex-col px-2'>
                <span className='h-3 sm:h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-[80%] mb-3 sm:mb-4' />
                <span className='h-2.5 sm:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[40%] mb-2' />
                <span className='h-2.5 sm:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[60%]' />
              </div>
            </li>
          ))}
      </ul>
    )
  }

  if (!comics || comics.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 dark:text-gray-400'>
          {emptyMessage || 'Không tìm thấy truyện'}
        </p>
      </div>
    )
  }

  return (
    <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 xl:gap-4'>
      {comics.map((item, index) => (
        <li
          key={item.id}
          className='group relative transform hover:scale-[1.02] transition-all duration-200 hover:z-10'
        >
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg' />
          <CardItem data={item} index={index} />
        </li>
      ))}
    </ul>
  )
}

export default ComicsGrid
