import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'

interface StatusFilterTabsProps {
  currentStatus: string
  queryConfig: any
  pathname: string
}

const StatusFilterTabs = ({ currentStatus, queryConfig }: StatusFilterTabsProps) => {
  return (
    <div className='flex items-center gap-2'>
      <Link
        title='Tất cả truyện'
        className={classNames(
          'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline',
          {
            'bg-primary text-white hover:no-underline hover:!text-white': currentStatus === 'all',
            'bg-transparent text-primary': currentStatus !== 'all'
          }
        )}
        to={{
          search: createSearchParams({
            ...(queryConfig as Record<string, string>),
            page: '1',
            status: 'all'
          }).toString()
        }}
      >
        tất cả
      </Link>
      <Link
        title='Truyện đã hoàn thành'
        className={classNames(
          'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline',
          {
            'bg-primary text-white hover:no-underline hover:!text-white': currentStatus === 'completed',
            'bg-transparent text-primary': currentStatus !== 'completed'
          }
        )}
        to={{
          search: createSearchParams({
            ...(queryConfig as Record<string, string>),
            page: '1',
            status: 'completed'
          }).toString()
        }}
      >
        hoàn thành
      </Link>
      <Link
        title='Truyện đang cập nhật'
        className={classNames(
          'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline',
          {
            'bg-primary text-white hover:no-underline hover:!text-white': currentStatus === 'updating',
            'bg-transparent text-primary': currentStatus !== 'updating'
          }
        )}
        to={{
          search: createSearchParams({
            ...(queryConfig as Record<string, string>),
            page: '1',
            status: 'updating'
          }).toString()
        }}
      >
        cập nhật
      </Link>
    </div>
  )
}

export default StatusFilterTabs
