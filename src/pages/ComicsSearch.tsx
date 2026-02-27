import comicApis from '@/apis/comicApis'
import { MiniPagination, Pagination } from '@/components'
import { PaginationSkeleton, MiniPaginationSkeleton } from '@/components/Skeletons'
import { useQueryConfig, useScrollTop } from '@/hooks'
import PATH from '@/utils/path'
import { SITE_NAME } from '@/config/siteConfig'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { useMediaQuery } from 'react-responsive'
import { Link, createSearchParams } from 'react-router-dom'
import { comics } from '@/types/data'
import { trackSearch } from '@/utils/analytics'
import { highlightText, highlightHtmlContent } from '@/utils/textHighlight'
import { useEffect, useMemo } from 'react'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'
import imgError from '/img-error.webp'

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

  const comicsList = dataSearch?.comics
  const totalComics = comicsList?.length ?? 0
  const totalEntries = totalComics
  const hasResults = Array.isArray(comicsList) && comicsList.length > 0
  const showEmpty = !isFetching && ((Array.isArray(comicsList) && comicsList.length === 0) || isError)

  return (
    <>
      <Helmet>
        <title>{queryConfig.q ? `Kết quả tìm kiếm "${queryConfig.q}" - ${SITE_NAME}` : `Tìm truyện tranh - ${SITE_NAME}`}</title>
        <meta
          name='description'
          content={queryConfig.q ? `Kết quả tìm kiếm truyện tranh "${queryConfig.q}" tại ${SITE_NAME}` : `Tìm truyện tranh - Tất cả truyện đều có thể tìm thấy tại ${SITE_NAME}`}
        />
        <link rel='canonical' href={canonicalUrl} />
        {prevUrl && <link rel='prev' href={prevUrl} />}
        {nextUrl && <link rel='next' href={nextUrl} />}
      </Helmet>
      <div className='min-h-screen bg-white dark:bg-neutral-900'>
        <div className='container max-w-[1100px] px-4 sm:px-6 py-5 sm:py-6'>
          {/* Breadcrumb */}
          <nav className='flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 mb-4'>
            <Link to={PATH.home} className='hover:text-primary transition-colors'>
              Trang chủ
            </Link>
            <span aria-hidden>/</span>
            <Link to={{ pathname: PATH.search, search: createSearchParams({ q: queryConfig.q || '', page: '1' }).toString() }} className='hover:text-primary transition-colors'>
              Tìm kiếm
            </Link>
            {queryConfig.q && (
              <>
                <span aria-hidden>/</span>
                <span className='text-primary font-medium truncate max-w-[180px] sm:max-w-none' title={queryConfig.q}>
                  &quot;{queryConfig.q}&quot;
                </span>
              </>
            )}
          </nav>

          {/* Title + pagination */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white'>
                Kết quả tìm kiếm
              </h1>
              {queryConfig.q && (
                <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-400'>
                  {hasResults && !isFetching
                    ? `Tìm thấy ${totalEntries > 0 ? totalEntries : totalComics} kết quả cho từ khóa "${queryConfig.q}"`
                    : `Từ khóa: "${queryConfig.q}"`}
                </p>
              )}
            </div>
            {dataSearch?.total_pages && dataSearch.total_pages > 1 && !isMobile && (
              <div className='flex-shrink-0'>
                <MiniPagination
                  queryConfig={queryConfig}
                  page={Number(queryConfig.page)}
                  totalPage={dataSearch.total_pages}
                />
              </div>
            )}
            {!isMobile && isFetching && dataSearch?.total_pages == null && <MiniPaginationSkeleton />}
          </div>

          {/* Results */}
          <div className='min-h-[400px]'>
            {hasResults && !isFetching &&
              (isMobile
                ? renderMobileComics(dataSearch!.comics, queryConfig.q || '')
                : renderDesktopComics(dataSearch!.comics, queryConfig.q || ''))}
            {showEmpty && (
              <div className='flex flex-col items-center justify-center min-h-[400px] text-center px-4'>
                <p className='text-lg sm:text-xl font-medium text-neutral-800 dark:text-white'>
                  Không tìm thấy truyện
                </p>
                <p className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
                  {queryConfig.q ? `Thử từ khóa khác hoặc kiểm tra chính tả cho &quot;${queryConfig.q}&quot;` : 'Nhập từ khóa để tìm truyện.'}
                </p>
              </div>
            )}
            {isFetching && <Skeleton />}
          </div>

          {/* Bottom pagination */}
          <div className='mt-8 sm:mt-10'>
            {dataSearch?.total_pages && dataSearch.total_pages > 1 ? (
              <Pagination
                queryConfig={queryConfig}
                page={Number(queryConfig.page)}
                totalPage={dataSearch.total_pages}
              />
            ) : (
              isFetching && <PaginationSkeleton />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default ComicsSearch

const Skeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse'>
    {Array(6)
      .fill(0)
      .map((_, i) => (
        <div key={i} className='flex gap-3 sm:gap-4'>
          <div className='w-[100px] sm:w-[120px] h-[133px] sm:h-[160px] bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0' />
          <div className='flex-1 min-w-0 space-y-2'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
            <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-12' />
            <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full' />
            <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5' />
            <div className='flex gap-2 pt-1'>
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-16' />
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-14' />
            </div>
          </div>
        </div>
      ))}
  </div>
)

const renderDesktopComics = (comicsList: comics[], searchTerm: string) => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
    {comicsList.map((comic) => (
      <Link
        key={comic.id}
        to={`${PATH.comics}/${comic.slug}-${comic.id}`}
        title={comic.title}
        className='flex gap-3 sm:gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-200'
      >
        <div className='relative flex-shrink-0'>
          <img
            src={comic.thumbnail}
            alt={comic.title}
            width={120}
            height={160}
            className='w-[100px] sm:w-[120px] h-[133px] sm:h-[160px] object-cover rounded-lg'
            loading='lazy'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = imgError
            }}
          />
          <div className='absolute inset-0 rounded-lg ring-1 ring-black/5 dark:ring-white/5' />
        </div>
        <div className='flex flex-col flex-1 min-w-0'>
          <h3 className='font-semibold text-neutral-900 dark:text-white line-clamp-2 text-[15px] leading-snug'>
            {highlightText(comic.title, searchTerm)}
          </h3>
          <span className='text-xs text-neutral-500 dark:text-neutral-400 mt-0.5'>{comic.updated_at}</span>
          <p
            className='text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed'
            dangerouslySetInnerHTML={{ __html: highlightHtmlContent(comic.short_description, searchTerm) }}
          />
          <div className='mt-auto pt-2'>
            <Link
              to={`${PATH.comics}/${comic.slug}-${comic.id}/${comic.last_chapter.slug_chapter}/${comic.last_chapter.id}`}
              title={comic.last_chapter.name}
              onClick={(e) => e.stopPropagation()}
              className='text-sm font-medium text-primary hover:underline line-clamp-1'
            >
              {comic.last_chapter.name}
            </Link>
          </div>
        </div>
      </Link>
    ))}
  </div>
)

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
