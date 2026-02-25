import { CardItem } from '@/components'
import { comics } from '@/types/data'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  data?: comics[]
  title: string
  icon?: string
  path: string
}

const HomeComicList = ({ data, title, path }: Props) => {
  if (!data || data.length === 0) return null
  return (
    <div className='relative bg-white dark:bg-dark-surface rounded-2xl sm:rounded-xl p-4 sm:p-6 shadow-sm border border-light-border dark:border-dark-highlight'>
      {/* Title Section */}
      <div className='flex items-center justify-between mb-6 sm:mb-8 px-2'>
        <div className='flex items-center gap-3 lg:gap-4'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-2 bg-clip-text text-transparent min-h-[28px] sm:min-h-[32px]'>{title}</h2>
        </div>
        <Link
          to={{
            pathname: path,
            search: createSearchParams({
              page: '1'
            }).toString()
          }}
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

      {/* Comics Grid */}
      <div className='min-h-[200px]'>
        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3 xl:gap-4'>
          {data.map((item, index) => (
            <li key={item.id}>
              <CardItem data={item} index={index} />
            </li>
          ))}
        </ul>
      </div>

      {/* View More Button */}
      <div className='mt-8 text-center'>
        <Link
          to={{
            pathname: path,
            search: createSearchParams({
              page: '1'
            }).toString()
          }}
          className='inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors'
        >
          Xem thêm
        </Link>
      </div>
    </div>
  )
}

export default HomeComicList
