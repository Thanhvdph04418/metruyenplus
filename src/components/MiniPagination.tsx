import { paramOption } from '@/apis/comicApis'
import classNames from 'classnames'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  totalPage: number
  page: number
  queryConfig: paramOption
}

const MiniPagination = ({ totalPage, page, queryConfig }: Props) => {
  const navigate = useNavigate()

  const nextPage = () => {
    if (page < totalPage) {
      navigate({
        search: createSearchParams({
          ...(queryConfig as Record<string, string>),
          page: (page + 1).toString()
        }).toString()
      })
    }
  }
  const PrevPage = () => {
    if (page > 1) {
      navigate({
        search: createSearchParams({
          ...(queryConfig as Record<string, string>),
          page: (page - 1).toString()
        }).toString()
      })
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <span className='text-[13px] text-neutral-600 dark:text-neutral-400 tabular-nums'>
        <span className='font-medium text-primary'>{page}</span>
        <span className='mx-0.5'>/</span>
        {totalPage}
      </span>
      <div className='flex items-center gap-1'>
        <button
          type='button'
          title='Trang trước'
          onClick={PrevPage}
          className={classNames(
            'p-2 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 flex justify-center',
            page === 1 ? 'opacity-50 cursor-default' : 'hover:border-primary hover:text-primary'
          )}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>
        <button
          type='button'
          title='Trang sau'
          onClick={nextPage}
          className={classNames(
            'p-2 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 flex justify-center',
            totalPage === page
              ? 'opacity-50 cursor-default'
              : 'hover:border-primary hover:text-primary'
          )}
        >
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
        </button>
      </div>
    </div>
  )
}

export default MiniPagination
