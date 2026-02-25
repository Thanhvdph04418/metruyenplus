import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import { dataGenres } from '@/types/data'
import { useEffect, useRef } from 'react'

interface GenreSelectorProps {
  genres: dataGenres
  selectedType: string
  queryConfig: any
}

const GenreSelector = ({ genres, selectedType, queryConfig }: GenreSelectorProps) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const element = document.getElementById(selectedType)
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [selectedType])

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
  }

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
  }

  return (
    <div className='relative px-2 sm:px-5 py-4 sm:py-6 bg-[#f8f8f9] dark:bg-gray-800'>
      <ul
        ref={scrollContainerRef}
        className='container scrollbar-hide relative grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2 sm:gap-3 max-h-[200px] sm:max-h-[160px] overflow-auto border-t-4 border-primary bg-white dark:bg-gray-900 py-3 sm:py-4 px-2 sm:px-6 rounded-lg shadow-md'
      >
        {genres.map((item) => {
          const isSelected = selectedType === item.id || (!selectedType && item.id === 'all')

          return (
            <li key={item.id} id={item.id} className='relative group hover:z-20'>
              <Link
                title={item.name}
                className={classNames(
                  'border dark:border-gray-600 text-black dark:text-white text-center min-w-[90px] sm:min-w-[130px] overflow-hidden rounded-lg px-3 sm:px-12 py-2 sm:py-2.5 flex items-center justify-center font-medium sm:font-semibold text-sm sm:text-base leading-5 whitespace-nowrap transition-all duration-200 hover:shadow-md',
                  {
                    'text-white bg-primary shadow-lg scale-[1.02] z-10': isSelected,
                    'hover:text-primary hover:border-primary hover:scale-[1.02] dark:hover:text-primary dark:hover:border-primary':
                      !isSelected
                  }
                )}
                to={{
                  search: createSearchParams({
                    ...queryConfig,
                    page: '1',
                    type: item.id
                  }).toString()
                }}
              >
                {item.name}
                <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700' />
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Scroll buttons */}
      <button
        className='hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity z-10'
        onClick={handleScrollLeft}
      >
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      </button>
      <button
        className='hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity z-10'
        onClick={handleScrollRight}
      >
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Mobile scroll indicator */}
      <div className='flex sm:hidden justify-center mt-2 gap-1'>
        <div className='w-8 h-1 bg-primary rounded-full' />
        <div className='w-1 h-1 bg-gray-300 rounded-full' />
        <div className='w-1 h-1 bg-gray-300 rounded-full' />
      </div>
    </div>
  )
}

export default GenreSelector
