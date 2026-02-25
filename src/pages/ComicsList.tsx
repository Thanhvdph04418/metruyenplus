import comicApis from '@/apis/comicApis'
import { ComicListRow, MiniPagination, Pagination } from '@/components'
import { PaginationSkeleton, MiniPaginationSkeleton } from '@/components/Skeletons'
import { useQueryConfig, useTitle, useComicListLimit } from '@/hooks'
import PATH, { API_MAPPING_PATH } from '@/utils/path'
import { SITE_NAME } from '@/config/siteConfig'
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
        <title>{`Truyện tranh ${title} online - ${SITE_NAME}`}</title>
        <meta
          name='description'
          content={`Truyện tranh ${title} online - Tất cả truyện ${title} có thể tìm thấy tại ${SITE_NAME}`}
        />
        {/* Canonical URL - always points to page 1 to avoid duplicates */}
        <link rel='canonical' href={canonicalUrl} />

        {/* Pagination links for SEO */}
        {prevUrl && <link rel='prev' href={prevUrl} />}
        {nextUrl && <link rel='next' href={nextUrl} />}
      </Helmet>
      <div className='min-h-screen bg-white dark:bg-neutral-900'>
        <div className='container px-4 sm:px-6 xl:px-0 py-5 sm:py-6 max-w-[1100px]'>
          {data?.data.status === 404 || isError || isErrorNew ? (
            <NotFound />
          ) : (
            <>
              {/* Header: label + filters (when top/new) + page nav */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                <div className='flex flex-col gap-3'>
                  <p className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                    {title}
                  </p>
                  {isTopAndNew && (
                    <div className='inline-flex p-0.5 rounded bg-neutral-100 dark:bg-neutral-800 gap-0.5'>
                      <Link
                        title='Tất cả truyện'
                        className={classNames(
                          'px-2.5 py-1.5 rounded text-sm font-medium',
                          queryConfig.status === 'all'
                            ? 'bg-white dark:bg-neutral-700 text-primary'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                        )}
                        to={{
                          search: createSearchParams({
                            ...(queryConfig as Record<string, string>),
                            page: '1',
                            status: 'all'
                          }).toString()
                        }}
                      >
                        Tất cả
                      </Link>
                      <Link
                        title='Truyện đã hoàn thành'
                        className={classNames(
                          'px-2.5 py-1.5 rounded text-sm font-medium',
                          queryConfig.status === 'completed'
                            ? 'bg-white dark:bg-neutral-700 text-primary'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                        )}
                        to={{
                          search: createSearchParams({
                            ...(queryConfig as Record<string, string>),
                            page: '1',
                            status: 'completed'
                          }).toString()
                        }}
                      >
                        Hoàn thành
                      </Link>
                      <Link
                        title='Truyện đang cập nhật'
                        className={classNames(
                          'px-2.5 py-1.5 rounded text-sm font-medium',
                          queryConfig.status === 'updating'
                            ? 'bg-white dark:bg-neutral-700 text-primary'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                        )}
                        to={{
                          search: createSearchParams({
                            ...(queryConfig as Record<string, string>),
                            page: '1',
                            status: 'updating'
                          }).toString()
                        }}
                      >
                        Cập nhật
                      </Link>
                    </div>
                  )}
                </div>
                {!isTopAndNew || !isMobile ? (
                  <div className='flex items-center gap-2 shrink-0'>
                    {totalPage ? (
                      <MiniPagination
                        queryConfig={queryConfig}
                        page={Number(queryConfig.page)}
                        totalPage={totalPage}
                      />
                    ) : (
                      !dataComics && <MiniPaginationSkeleton />
                    )}
                  </div>
                ) : null}
              </div>

              {/* List layout — 2 columns */}
              <div className='border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden'>
                {dataComics?.comics?.length ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6'>
                    <div className='divide-y divide-neutral-200 dark:divide-neutral-700 px-3 md:px-4'>
                      {dataComics.comics
                        .filter((_, i) => i % 2 === 0)
                        .map((item, index) => (
                          <ComicListRow key={item.id} data={item} index={index * 2} />
                        ))}
                    </div>
                    {/* Right column */}
                    <div className='divide-y divide-neutral-200 dark:divide-neutral-700 px-3 md:px-4'>
                      {dataComics.comics
                        .filter((_, i) => i % 2 === 1)
                        .map((item, index) => (
                          <ComicListRow key={item.id} data={item} index={index * 2 + 1} />
                        ))}
                    </div>
                  </div>
                ) : dataComics && !dataComics.comics?.length ? (
                  <div className='py-12 text-center text-neutral-500 dark:text-neutral-400 text-sm'>
                    Chưa có truyện nào.
                  </div>
                ) : (
                  !dataComics && listSkeleton(comicListLimit)
                )}
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
      </div>
    </>
  )
}
export default ComicsList

function listSkeleton(limit: number = 16) {
  const half = Math.ceil(limit / 2)
  const row = (i: number) => (
    <div key={i} className='flex items-center gap-3 py-3 animate-pulse'>
      <div className='w-20 h-[6.5rem] rounded-lg bg-neutral-200 dark:bg-neutral-700 shrink-0' />
      <div className='flex-1 space-y-2'>
        <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4' />
        <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2' />
      </div>
      <div className='h-3 w-14 bg-neutral-200 dark:bg-neutral-700 rounded shrink-0' />
    </div>
  )
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6'>
      <div className='divide-y divide-neutral-200 dark:divide-neutral-700 px-3 md:px-4'>
        {Array(half)
          .fill(0)
          .map((_, i) => row(i))}
      </div>
      <div className='divide-y divide-neutral-200 dark:divide-neutral-700 px-3 md:px-4'>
        {Array(half)
          .fill(0)
          .map((_, i) => row(half + i))}
      </div>
    </div>
  )
}
