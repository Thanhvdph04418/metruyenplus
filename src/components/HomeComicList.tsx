import { CardItem, ComicListRow } from '@/components'
import { comics } from '@/types/data'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  data?: comics[]
  title: string
  path: string
  /** 'grid' = card grid (default), 'list' = compact row list */
  layout?: 'grid' | 'list'
}

const HomeComicList = ({ data, title, path, layout = 'grid' }: Props) => {
  if (!data || data.length === 0) return null

  const search = createSearchParams({ page: '1' }).toString()

  if (layout === 'list') {
    return (
      <div className='relative'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
            {title}
          </h2>
          <Link to={{ pathname: path, search }} className='text-sm text-primary hover:underline'>
            Xem tất cả →
          </Link>
        </div>
        <div className='divide-y divide-neutral-200 dark:divide-neutral-700'>
          {data.map((item, index) => (
            <ComicListRow key={item.id} data={item} index={index} />
          ))}
        </div>
        <div className='mt-4'>
          <Link
            to={{ pathname: path, search }}
            className='block text-center py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary border border-neutral-200 dark:border-neutral-700 rounded'
          >
            Xem thêm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='relative'>
      <div className='flex items-center justify-between mb-5'>
<h2 className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
        {title}
      </h2>
      <Link to={{ pathname: path, search }} className='text-sm text-primary hover:underline'>
        Xem tất cả →
      </Link>
    </div>
    <div className='min-h-[200px]'>
      <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
        {data.map((item, index) => (
          <li key={item.id}>
            <CardItem data={item} index={index} />
          </li>
        ))}
      </ul>
    </div>
    <div className='mt-5 text-center'>
      <Link
        to={{ pathname: path, search }}
        className='inline-block px-4 py-2 text-sm text-primary border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800'
      >
          Xem thêm
        </Link>
      </div>
    </div>
  )
}

export default HomeComicList
