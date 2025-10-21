import comicApis from '@/apis/comicApis'
import { MiniPagination, Pagination } from '@/components'
import { PaginationSkeleton, MiniPaginationSkeleton } from '@/components/Skeletons'
import { renderSwiperSlide } from '@/components/Preview/RecentUpdateComics'
import { useQueryConfig, useScrollTop } from '@/hooks'
import PATH from '@/utils/path'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { comics } from '@/types/data'
import { trackSearch } from '@/utils/analytics'
import { highlightText, highlightHtmlContent } from '@/utils/textHighlight'
import { useEffect, useMemo } from 'react'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'

const ComicsSearch = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const queryConfig = useQueryConfig()
  useScrollTop([queryConfig.q, queryConfig.page])

  const { data, isError, isFetching } = useQuery({
    queryKey: ['search-comic', queryConfig],
    queryFn: () => comicApis.getSearch(queryConfig),
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true
  })
  const dataSearch = data?.data

  // Track search events
  useEffect(() => {
    if (queryConfig.q && dataSearch && !isFetching) {
      trackSearch({
        search_query: queryConfig.q,
        results_count: dataSearch.comics?.length || 0
      })
    }
  }, [queryConfig.q, dataSearch, isFetching])

  // Generate canonical URL and pagination links
  const canonicalUrl = useMemo(
    () => generateCanonicalUrl('/tim-kiem', ['q'], { q: queryConfig.q || '' }),
    [queryConfig.q]
  )

  const currentPage = useMemo(() => Number(queryConfig.page) || 1, [queryConfig.page])
  const totalPages = dataSearch?.total_pages || 1
  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < totalPages

  const prevUrl = useMemo(
    () =>
      showPrevLink
        ? generatePaginationUrl('/tim-kiem', currentPage - 1, ['q'], { q: queryConfig.q || '' })
        : null,
    [showPrevLink, currentPage, queryConfig.q]
  )

  const nextUrl = useMemo(
    () =>
      showNextLink
        ? generatePaginationUrl('/tim-kiem', currentPage + 1, ['q'], { q: queryConfig.q || '' })
        : null,
    [showNextLink, currentPage, queryConfig.q, totalPages]
  )

  return (
    <>
      <Helmet>
        <title>Tìm truyện tranh online - Tcomic</title>
        <meta
          name='description'
          content='Tìm truyện tranh - Tất cả truyện đều có thể tìm thấy tại Tcomic'
        />
        {/* Canonical URL - always points to page 1 with search query */}
        <link rel='canonical' href={canonicalUrl} />

        {/* Pagination links for SEO */}
        {prevUrl && <link rel='prev' href={prevUrl} />}
        {nextUrl && <link rel='next' href={nextUrl} />}
      </Helmet>
      <div className='container px-4 lg:px-0'>
        <div className='mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
          <div className='flex items-center gap-2 text-black dark:text-white'>
            <Link
              to={PATH.home}
              className='flex items-center gap-1 hover:text-primary text-base sm:text-lg'
              title='Trang chủ'
            >
              Trang chủ{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                aria-hidden='true'
                className='w-5 h-5'
                viewBox='0 0 48 48'
              >
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M19 12L31 24L19 36'
                />
              </svg>
            </Link>
            <span className='flex items-center gap-1 text-base sm:text-lg'>
              Tìm kiếm{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                aria-hidden='true'
                className='w-5 h-5'
                viewBox='0 0 48 48'
              >
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M19 12L31 24L19 36'
                />
              </svg>
            </span>
            <span className='text-primary text-base sm:text-lg break-all'>"{queryConfig.q}"</span>
          </div>
          {dataSearch?.total_pages && !isMobile ? (
            <MiniPagination
              queryConfig={queryConfig}
              page={Number(queryConfig.page)}
              totalPage={dataSearch?.total_pages}
            />
          ) : (
            !isMobile && isFetching && <MiniPaginationSkeleton />
          )}
        </div>
        <div className='mt-6 sm:mt-8 min-h-[550px]'>
          {dataSearch &&
            !isFetching &&
            dataSearch?.comics.length > 0 &&
            (isMobile
              ? renderMobileComics(dataSearch.comics, queryConfig.q || '')
              : renderSwiperSlide(dataSearch.comics, 2, '6', queryConfig.q || ''))}
          {!isFetching &&
            ((Array.isArray(dataSearch?.comics) && !dataSearch?.comics.length) || isError) && (
              <div className='flex items-center justify-center text-2xl h-[550px] text-black dark:text-white'>
                Không tìm thấy truyện với kết quả
              </div>
            )}
          {isFetching && Skeleton()}
        </div>
        <div className='mt-8 sm:mt-14'>
          {dataSearch?.total_pages ? (
            <Pagination
              queryConfig={queryConfig}
              page={Number(queryConfig.page)}
              totalPage={dataSearch?.total_pages}
            />
          ) : (
            isFetching && <PaginationSkeleton />
          )}
        </div>
      </div>
    </>
  )
}
export default ComicsSearch

const Skeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4 sm:gap-6 h-full w-full animate-pulse overflow-hidden'>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className='flex col-span-1 sm:col-span-6'>
            <div className='flex items-center justify-center w-[120px] sm:w-[165px] h-[160px] sm:h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
              <svg
                className='w-10 h-10 text-gray-200 dark:text-gray-600'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
              >
                <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
              </svg>
            </div>
            <div className='w-full pl-3 sm:pl-[15px] pr-2 flex flex-col flex-1 justify-around'>
              <div>
                <div className='h-2.5 sm:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32 sm:w-40 mb-3 sm:mb-4 -mt-2' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-14 sm:w-16 -mt-2' />
              </div>
              <div>
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-36 sm:w-44 mb-2.5' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full sm:w-[350px] mb-2.5' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[250px] sm:w-[300px] mb-2.5' />
              </div>
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <div className='h-4 sm:h-5 bg-gray-200 rounded-md dark:bg-gray-700 w-12 sm:w-14' />
                <div className='h-4 sm:h-5 bg-gray-200 rounded-md dark:bg-gray-700 w-12 sm:w-14' />
                <div className='h-4 sm:h-5 bg-gray-200 rounded-md dark:bg-gray-700 w-12 sm:w-14' />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

const renderMobileComics = (comics: comics[], searchTerm: string = '') => {
  return (
    <div className='flex flex-col gap-5'>
      {comics.map((comic) => (
        <Link
          key={comic.id}
          to={`${PATH.comics}/${comic.slug}-${comic.id}`}
          className='flex gap-4 bg-white/80 dark:bg-gray-800/80 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200'
          title={comic.title}
        >
          <div className='relative flex-shrink-0'>
            <img
              src={comic.thumbnail}
              alt={comic.title}
              title={comic.title}
              className='w-[110px] h-[146px] object-cover rounded-lg shadow-sm'
            />
            <div className='absolute inset-0 rounded-lg ring-1 ring-black/5 dark:ring-white/5' />
          </div>
          <div className='flex flex-col flex-1 min-w-0 py-1'>
            <h3 className='font-semibold text-black dark:text-white line-clamp-2 text-[15px]'>
              {highlightText(comic.title, searchTerm)}
            </h3>
            <p
              className='text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed'
              dangerouslySetInnerHTML={{
                __html: highlightHtmlContent(comic.short_description, searchTerm)
              }}
            />
            <div className='mt-auto pt-3 flex gap-2.5 text-xs font-medium'>
              <span className='px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-md'>
                {comic.last_chapter.name}
              </span>
              <span className='px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-md'>
                {comic.updated_at}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
