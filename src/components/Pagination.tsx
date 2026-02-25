import { paramOption } from '@/apis/comicApis'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  totalPage: number
  page: number
  queryConfig: paramOption
}
const RANGE = 2
export default function Pagination({ page, totalPage, queryConfig }: Props) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='px-1 text-neutral-400'>
            …
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='px-1 text-neutral-400'>
            …
          </span>
        )
      }
      return null
    }
    return Array(totalPage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (
          page <= RANGE * 2 + 1 &&
          pageNumber > page + RANGE &&
          pageNumber < totalPage - RANGE + 1
        ) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < totalPage - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < totalPage - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (
          page >= totalPage - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < page - RANGE
        ) {
          return renderDotBefore(index)
        }

        return (
          <Link
            title={`Trang ${pageNumber}`}
            to={{
              search: createSearchParams({
                ...(queryConfig as Record<string, string>),
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames(
              'mx-0.5 cursor-pointer rounded border px-3 h-9 flex items-center justify-center text-sm font-medium transition-colors',
              pageNumber === page
                ? 'border-primary text-primary bg-primary/5'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary hover:text-primary bg-white dark:bg-neutral-900'
            )}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <nav className='flex flex-wrap justify-center items-center gap-1 gap-y-2' aria-label='Phân trang'>
      {page === 1 ? (
        <span className='cursor-default rounded border border-neutral-200 dark:border-neutral-700 px-3 h-9 flex items-center justify-center text-neutral-400' aria-hidden>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </span>
      ) : (
        <Link
          title='Trang trước'
          to={{
            search: createSearchParams({
              ...(queryConfig as Record<string, string>),
              page: (page - 1).toString()
            }).toString()
          }}
          className='rounded border border-neutral-200 dark:border-neutral-700 px-3 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:border-primary hover:text-primary transition-colors'
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </Link>
      )}

      {renderPagination()}

      {page === totalPage ? (
        <span className='cursor-default rounded border border-neutral-200 dark:border-neutral-700 px-3 h-9 flex items-center justify-center text-neutral-400' aria-hidden>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </span>
      ) : (
        <Link
          title='Trang sau'
          to={{
            search: createSearchParams({
              ...(queryConfig as Record<string, string>),
              page: (page + 1).toString()
            }).toString()
          }}
          className='rounded border border-neutral-200 dark:border-neutral-700 px-3 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:border-primary hover:text-primary transition-colors'
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </Link>
      )}
    </nav>
  )
}
