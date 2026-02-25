import comicApis from '@/apis/comicApis'
import { comics } from '@/types/data'
import PATH, { PATH_MAPPING_API } from '@/utils/path'
import { useQuery } from 'react-query'
import { Link, createSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import imgError from '/img-error.webp'
import iconTop from '/icon-top.webp'
import { useMediaQuery } from 'react-responsive'

const HoverPreview = ({ comic, show }: { comic: comics; show: boolean }) => {
  if (!show) return null

  return (
    <div className='absolute left-full ml-4 top-0 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-72'>
      <div className='aspect-[3/4] w-32 mx-auto mb-3 overflow-hidden rounded-lg'>
        <img
          src={comic.thumbnail}
          alt={comic.title}
          title={comic.title}
          className='w-full h-full object-cover'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = imgError
          }}
        />
      </div>
      <h4 className='font-semibold text-black dark:text-white mb-2 line-clamp-2'>{comic.title}</h4>
      <div
        className='text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-3'
        dangerouslySetInnerHTML={{
          __html: comic.short_description || 'Chưa có mô tả'
        }}
      />
      <div className='flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400'>
        {comic.genres?.slice(0, 3).map((genre, idx) => (
          <span key={idx} className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded'>
            {genre.name}
          </span>
        ))}
      </div>
      <div className='mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
        <span className='flex items-center gap-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' />
            <path
              fillRule='evenodd'
              d='M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
              clipRule='evenodd'
            />
          </svg>
          {comic.total_views.toLocaleString()}
        </span>
        <span className='flex items-center gap-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
          </svg>
          {comic.followers?.toLocaleString() || '0'}
        </span>
      </div>
    </div>
  )
}

const TopComicsList = ({ data }: { data: comics[] }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const isMobile = useMediaQuery({ maxWidth: 640 })

  return (
    <ul className='mt-5 flex flex-col gap-3'>
      {data.map((item, index) => (
        <li
          key={item.id}
          className='relative flex items-center gap-4 pb-3 border-b border-dashed border-[#ededed] dark:border-gray-600 group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg p-2'
          onMouseEnter={() => !isMobile && setHoveredId(item.id)}
          onMouseLeave={() => !isMobile && setHoveredId(null)}
        >
          <span
            className={`flex-shrink-0 flex items-center justify-center rounded-full w-7 h-7 font-bold
                   ${
                     index === 0 &&
                     'bg-gradient-to-r from-yellow-400 to-yellow-300 text-white shadow-sm'
                   } 
                   ${
                     index === 1 &&
                     'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 shadow-sm'
                   } 
                   ${
                     index === 2 &&
                     'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm'
                   } 
                   ${index > 2 && 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
          >
            {index + 1}
          </span>
          <Link
            to={`${PATH.comics}/${item.slug}-${item.id}`}
            title={item.title}
            className='flex-shrink-0 overflow-hidden rounded-md shadow-sm transition-transform group-hover:scale-105'
          >
            <img
              loading='lazy'
              src={item.thumbnail}
              alt={item.title}
              title={item.title}
              className='object-cover object-center w-24 h-16'
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = imgError
              }}
            />
          </Link>
          <div className='flex-1 min-w-0'>
            <Link
              title={item.title}
              to={`${PATH.comics}/${item.slug}-${item.id}`}
              className='block hover:text-primary text-black dark:text-white dark:hover:text-primary font-semibold text-base leading-tight line-clamp-1 mb-1'
            >
              {item.title}
            </Link>
            <p className='flex items-center gap-1 text-gray-400 text-sm'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='w-4 h-4'
              >
                <path d='M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' />
                <path
                  fillRule='evenodd'
                  d='M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                  clipRule='evenodd'
                />
              </svg>
              {item.total_views.toLocaleString()} lượt xem
            </p>
          </div>

          {/* Hover Preview */}
          {!isMobile && <HoverPreview comic={item} show={hoveredId === item.id} />}
        </li>
      ))}
    </ul>
  )
}

const TopPreviewComics = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { data: dataDaily } = useQuery({
    queryKey: [`${PATH_MAPPING_API.top}${PATH_MAPPING_API.daily}`, { page: '1', status: 'all' }],
    queryFn: () =>
      comicApis.getComicsByUrl(`${PATH_MAPPING_API.top}${PATH_MAPPING_API.daily}`, {
        page: '1',
        status: 'all'
      }),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  const { data: dataWeekly } = useQuery({
    queryKey: [`${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`, { page: '1', status: 'all' }],
    queryFn: () =>
      comicApis.getComicsByUrl(`${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`, {
        page: '1',
        status: 'all'
      }),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  const { data: dataMonthly } = useQuery({
    queryKey: [`${PATH_MAPPING_API.top}${PATH_MAPPING_API.monthly}`, { page: '1', status: 'all' }],
    queryFn: () =>
      comicApis.getComicsByUrl(`${PATH_MAPPING_API.top}${PATH_MAPPING_API.monthly}`, {
        page: '1',
        status: 'all'
      }),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  const dataDailyComics = useMemo(() => dataDaily?.data.comics, [dataDaily])
  const dataWeeklyComics = useMemo(() => dataWeekly?.data.comics, [dataWeekly])
  const dataMonthlyComics = useMemo(() => dataMonthly?.data.comics, [dataMonthly])

  return (
    <>
      <div className='flex sm:hidden items-end'>
        <div className='flex items-center gap-2'>
          <img src={iconTop} alt='icon' className='w-auto h-[28px]' />
          <h2 className='capitalize text-2xl font-bold leading-5 text-black dark:text-white'>
            BXH
          </h2>
        </div>
        <Link
          to={{
            pathname: PATH.top,
            search: createSearchParams({
              status: 'all',
              page: '1'
            }).toString()
          }}
          className='flex flex-1 items-center justify-end gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
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
      <div className='grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-3 lg:gap-5 justify-items-center justify-center w-full min-h-[323px]'>
        <div className='col-span-4 w-full'>
          <div className='hidden sm:flex items-end'>
            <h3 className='capitalize text-xl font-bold leading-5 text-black dark:text-white'>
              top ngày
            </h3>
            <Link
              title='Top ngày'
              to={{
                pathname: `${PATH.top}${PATH.daily}`,
                search: createSearchParams({
                  status: 'all',
                  page: '1'
                }).toString()
              }}
              className='flex flex-1 justify-end items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
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
          {dataDailyComics && <TopComicsList data={dataDailyComics.slice(0, 5)} />}
          {!dataDailyComics && (isMobile ? skeleton(5) : skeleton(5))}
        </div>
        <div className='hidden sm:block col-span-4 w-full'>
          <div className='hidden sm:flex items-end'>
            <h3 className='capitalize text-xl font-bold leading-5 text-black dark:text-white'>
              top tuần
            </h3>
            <Link
              title='Top tuần'
              to={{
                pathname: `${PATH.top}${PATH.weekly}`,
                search: createSearchParams({
                  status: 'all',
                  page: '1'
                }).toString()
              }}
              className='flex flex-1 justify-end items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
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
          {dataWeeklyComics && <TopComicsList data={dataWeeklyComics.slice(0, 5)} />}
          {!dataWeeklyComics && skeleton(5)}
        </div>
        <div className='hidden md:block col-span-4 w-full'>
          <div className='hidden md:flex items-end'>
            <h3 className='capitalize text-xl font-bold leading-5 text-black dark:text-white'>
              top tháng
            </h3>
            <Link
              title='Top tháng'
              to={{
                pathname: `${PATH.top}${PATH.monthly}`,
                search: createSearchParams({
                  status: 'all',
                  page: '1'
                }).toString()
              }}
              className='flex flex-1 justify-end items-center gap-1 text-sm text-black dark:text-white hover:text-primary dark:hover:text-primary'
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
          {dataMonthlyComics && <TopComicsList data={dataMonthlyComics.slice(0, 5)} />}
          {!dataMonthlyComics && skeleton(5)}
        </div>
      </div>
    </>
  )
}

export default TopPreviewComics

const skeleton = (number: number) => {
  return (
    <ul className='mt-5 flex flex-col gap-[5px] animate-pulse'>
      {Array(number)
        .fill(0)
        .map((_, i) => (
          <li key={i} className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-20 h-[50px] bg-gray-300 dark:bg-gray-700 flex-shrink-0 overflow-hidden'>
              <svg
                className='w-8 h-8 text-gray-200 dark:text-gray-600'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
              >
                <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
              </svg>
            </div>
            <div className='flex items-start gap-2'>
              <span className='w-[22px] h-[22px] -mt-[2px] bg-gray-200 rounded-full dark:bg-gray-700' />
              <div className='mt-[2px]'>
                <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 md:w-32 lg:w-48 mb-4 -mt-2' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-28 md:w-24 lg:w-36 -mt-2' />
              </div>
            </div>
          </li>
        ))}
    </ul>
  )
}
