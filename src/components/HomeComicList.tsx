import { CardItem } from '@/components'
import { comics } from '@/types/data'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  data?: comics[]
  title: string
  path: string
}

const HomeComicList = ({ data, title, path }: Props) => {
  if (!data || data.length === 0) return null
  return (
    <div className='relative'>
      {/* Title Section */}
      <div className='flex items-center justify-between mb-6 px-2'>
        <div className='flex items-center gap-2 lg:gap-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-7 h-7 lg:h-[32px] lg:w-[32px] text-primary'
            aria-hidden='true'
          >
            <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z' clipRule='evenodd' />
          </svg>
          <h2 className='text-xl font-bold text-gray-800 dark:text-white min-h-[28px]'>{title}</h2>
        </div>
        <Link
          to={{
            pathname: path,
            search: createSearchParams({
              page: '1'
            }).toString()
          }}
          className='flex items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
        >
          <span>Tất cả</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </Link>
      </div>

      {/* Comics Grid */}
      <div className='min-h-[200px]'>
        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 xl:gap-4'>
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
