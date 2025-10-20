import comicApis from '@/apis/comicApis'
import { CardItem, MiniPagination, Pagination } from '@/components'
import { PaginationSkeleton, MiniPaginationSkeleton } from '@/components/Skeletons'
import { useQueryConfig, useTitle, useComicListLimit } from '@/hooks'
import PATH, { API_MAPPING_PATH } from '@/utils/path'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, createSearchParams, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { NotFound } from '@/App'
import { Helmet } from 'react-helmet-async'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'

const ComicsList = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { pathname } = useLocation()
  const pathArray = pathname.split('/').filter(Boolean)
  const PATH_MAPPING = pathArray
    .map((item) => API_MAPPING_PATH[`/${item}` as keyof typeof API_MAPPING_PATH])
    .join('')
  const queryConfig = useQueryConfig()
  const { limit: comicListLimit, deviceType } = useComicListLimit()
  const title = useMemo(() => useTitle(pathname), [pathname])
  const isTopAndNew = useMemo(
    () => pathname.includes(PATH.new) || pathname.includes(PATH.top),
    [pathname]
  )

  // Create device-aware query config with responsive limit for comic listings
  const listQueryConfig = useMemo(
    () => ({
      ...queryConfig,
      limit: comicListLimit
    }),
    [queryConfig, comicListLimit]
  )

  const { data, isError } = useQuery({
    queryKey: [PATH_MAPPING, 'list', deviceType, comicListLimit, queryConfig],
    queryFn: () => comicApis.getComicsByUrl(PATH_MAPPING, listQueryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: pathname !== PATH.new
  })

  const { data: dataNew, isError: isErrorNew } = useQuery({
    queryKey: [pathname, 'list', deviceType, comicListLimit, queryConfig],
    queryFn: () => comicApis.getNew(listQueryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: pathname === PATH.new
  })

  const dataComics = useMemo(
    () => (pathname !== PATH.new ? data?.data : dataNew?.data),
    [pathname, data, dataNew]
  )

  const [totalPage, setTotalPage] = useState<number>()
  useEffect(() => {
    if (dataComics) {
      setTotalPage(dataComics.total_pages as number)
    }
  }, [pathname, dataComics])

  // Generate canonical URL and pagination links
  const canonicalUrl = useMemo(() => {
    // For top pages with status parameter, include it in canonical
    const allowedParams = isTopAndNew && queryConfig.status ? ['status'] : []
    return generateCanonicalUrl(pathname, allowedParams, queryConfig as Record<string, string>)
  }, [pathname, isTopAndNew, queryConfig])

  const currentPage = useMemo(() => Number(queryConfig.page) || 1, [queryConfig.page])
  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < (totalPage || 1)

  const prevUrl = useMemo(() => {
    if (!showPrevLink) return null
    const allowedParams = isTopAndNew && queryConfig.status ? ['status'] : []
    return generatePaginationUrl(
      pathname,
      currentPage - 1,
      allowedParams,
      queryConfig as Record<string, string>
    )
  }, [showPrevLink, currentPage, pathname, isTopAndNew, queryConfig])

  const nextUrl = useMemo(() => {
    if (!showNextLink) return null
    const allowedParams = isTopAndNew && queryConfig.status ? ['status'] : []
    return generatePaginationUrl(
      pathname,
      currentPage + 1,
      allowedParams,
      queryConfig as Record<string, string>
    )
  }, [showNextLink, currentPage, pathname, isTopAndNew, queryConfig, totalPage])

  return (
    <>
      <Helmet>
        <title>{`Truyện chữ ${title} online - MeTruyen+`}</title>
        <meta
          name='description'
          content={`Truyện chữ ${title} online - Tất cả truyện ${title} có thể tìm thấy tại MeTruyen+`}
        />
        {/* Canonical URL - always points to page 1 to avoid duplicates */}
        <link rel='canonical' href={canonicalUrl} />

        {/* Pagination links for SEO */}
        {prevUrl && <link rel='prev' href={prevUrl} />}
        {nextUrl && <link rel='next' href={nextUrl} />}
      </Helmet>
      <div className='container px-4 xl:px-0'>
        {data?.data.status === 404 || isError || isErrorNew ? (
          <NotFound />
        ) : (
          <>
            <div className='mt-8 flex items-center justify-between h-9'>
              {isTopAndNew ? (
                <div className='flex items-center gap-2'>
                  <Link
                    title='Tất cả truyện'
                    className={classNames(
                      'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline focus:outline-none',
                      {
                        'bg-primary text-white hover:no-underline': queryConfig.status === 'all',
                        'bg-transparent text-primary': queryConfig.status !== 'all'
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
                      'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline focus:outline-none',
                      {
                        'bg-primary text-white hover:no-underline':
                          queryConfig.status === 'completed',
                        'bg-transparent text-primary': queryConfig.status !== 'completed'
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
                      'capitalize text-center px-2 py-1 rounded-md border border-primary leading-5 hover:underline focus:outline-none',
                      {
                        'bg-primary text-white hover:no-underline':
                          queryConfig.status === 'updating',
                        'bg-transparent text-primary': queryConfig.status !== 'updating'
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
              ) : (
                <h2 className='capitalize font-semibold text-black dark:text-white text-xl lg:text-2xl'>
                  <strong className='text-primary'>{title}</strong>{' '}
                  <span className='hidden md:inline-block'>- trang {queryConfig.page}</span>
                  {/* Debug: showing {comicListLimit} items per page on {deviceType} */}
                </h2>
              )}
              {isTopAndNew && isMobile ? null : (
                <>
                  {totalPage ? (
                    <MiniPagination
                      queryConfig={queryConfig}
                      page={Number(queryConfig.page)}
                      totalPage={totalPage}
                    />
                  ) : (
                    !dataComics && <MiniPaginationSkeleton />
                  )}
                </>
              )}
            </div>
            <div className='mt-6 min-h-[600px]'>
              <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 xl:gap-x-[3px] gap-y-5'>
                {dataComics &&
                  dataComics.comics.map((item, index) => (
                    <li key={item.id}>
                      <CardItem data={item} index={index} />
                    </li>
                  ))}
                {!dataComics && skeleton(comicListLimit)}
              </ul>
            </div>
            <div className='mt-6'>
              {totalPage ? (
                <Pagination
                  queryConfig={queryConfig}
                  page={Number(queryConfig.page)}
                  totalPage={totalPage}
                />
              ) : (
                !dataComics && <PaginationSkeleton />
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default ComicsList

const skeleton = (limit: number = 21) => {
  return (
    <>
      {Array(limit)
        .fill(0)
        .map((_, i) => (
          <li key={i} className='w-full min-h-[292px] overflow-hidden animate-pulse'>
            <div className='flex items-center justify-center w-full h-[240px] xl:h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
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
            <div className='mt-2 flex flex-col'>
              <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 mt-1' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 mb-2' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32' />
            </div>
          </li>
        ))}
    </>
  )
}
