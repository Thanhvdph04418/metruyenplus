import comicApis from '@/apis/comicApis'
import { CardItem, MiniPagination, Pagination } from '@/components'
import { PaginationSkeleton } from '@/components/Skeletons'
import { useQueryConfig, useScrollTop } from '@/hooks'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useQuery } from 'react-query'
import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import { NotFound } from '@/App'
import { Helmet } from 'react-helmet-async'
import { dataGenres } from '@/types/data'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'

// Separate components for better organization
const GenreList = ({
  dataGenreComics,
  type,
  queryConfig
}: {
  dataGenreComics: dataGenres
  type: any
  queryConfig: any
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [dataGenreComics])

  return (
    <div className='relative w-full max-w-7xl mx-auto'>
      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center transition-all duration-200 ${
          canScrollLeft
            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
        aria-label='Scroll left'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-3 h-3 sm:w-4 sm:h-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center transition-all duration-200 ${
          canScrollRight
            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
        aria-label='Scroll right'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-3 h-3 sm:w-4 sm:h-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className='overflow-x-auto scrollbar-hide border-t-4 border-primary bg-white dark:bg-gray-900 rounded-xl shadow-md py-3 sm:py-4 px-8 sm:px-12'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className='flex gap-2 sm:gap-3 min-w-max'>
          {dataGenreComics ? (
            dataGenreComics.map((item: any) => (
              <GenreItem key={item.id} item={item} type={type} queryConfig={queryConfig} />
            ))
          ) : (
            <SkeletonGenre />
          )}
        </div>
      </div>
    </div>
  )
}

const GenreItem = ({ item, type, queryConfig }: { item: any; type: any; queryConfig: any }) => {
  const isSelected = type === item.id || (!type && item.id === 'all')

  return (
    <li id={item.id} className='relative group hover:z-20'>
      <Link
        title={item.name}
        className={classNames(
          'border dark:border-gray-600 text-black dark:text-white text-center min-w-[90px] sm:min-w-[110px] overflow-hidden rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center font-medium text-xs sm:text-sm leading-5 whitespace-nowrap transition-all duration-200 focus:outline-none flex-shrink-0',
          {
            'text-white bg-primary shadow-md z-10': isSelected,
            'hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none':
              !isSelected
          }
        )}
        to={{
          search: createSearchParams({
            ...queryConfig,
            page: '1',
            type: item.id
          }).toString()
        }}
      >
        {item.name}
        <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700' />
      </Link>
    </li>
  )
}

// ScrollButtons component removed - functionality integrated into GenreList

const ComicsList = () => {
  const queryConfig = useQueryConfig()
  useScrollTop([queryConfig])

  const type = useMemo(() => queryConfig.type ?? 'all', [queryConfig.type])

  // Data fetching
  const { data: dataGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => comicApis.getGenre(),
    staleTime: 3 * 60 * 1000
  })

  const { data, isError } = useQuery({
    queryKey: ['comicByGenre', type, queryConfig.page],
    queryFn: () => comicApis.getComicsByGenre(type, queryConfig),
    staleTime: 3 * 60 * 1000
  })

  const dataComics = data?.data
  const dataGenreComics = dataGenres?.data

  // Derived state
  const descGenre = useMemo(
    () =>
      dataGenreComics?.find((item) => item.id === type)?.description ??
      dataGenreComics?.at(0)?.description,
    [type, dataGenreComics]
  )

  const currentGenre = useMemo(
    () => dataGenreComics?.find((item) => item.id === type) ?? dataGenreComics?.at(0),
    [type, dataGenreComics]
  )

  // State management
  const [totalPage, setTotalPage] = useState<number>()

  useEffect(() => {
    if (dataComics) {
      setTotalPage(dataComics.total_pages as number)
    }
  }, [type, dataComics])

  useEffect(() => {
    document.getElementById(type)?.scrollIntoView({ block: 'center' })
  }, [type])

  if (data?.data.status === 404 || isError) {
    return <NotFound />
  }

  // Generate canonical URL and pagination links
  const canonicalUrl = useMemo(() => generateCanonicalUrl('/the-loai', ['type'], { type }), [type])

  const currentPage = useMemo(() => Number(queryConfig.page) || 1, [queryConfig.page])
  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < (totalPage || 1)

  const prevUrl = useMemo(
    () =>
      showPrevLink ? generatePaginationUrl('/the-loai', currentPage - 1, ['type'], { type }) : null,
    [showPrevLink, currentPage, type]
  )

  const nextUrl = useMemo(
    () =>
      showNextLink ? generatePaginationUrl('/the-loai', currentPage + 1, ['type'], { type }) : null,
    [showNextLink, currentPage, type, totalPage]
  )

  return (
    <>
      <Helmet>
        <title>{`Truyện Thể loại ${currentGenre?.name} - MeTruyen+`}</title>
        <meta
          name='description'
          content={`Truyện Thể loại ${currentGenre?.name} - ${currentGenre?.description}`}
        />
        {/* Canonical URL - always points to page 1 to avoid duplicates */}
        <link rel='canonical' href={canonicalUrl} />

        {/* Pagination links for SEO */}
        {prevUrl && <link rel='prev' href={prevUrl} />}
        {nextUrl && <link rel='next' href={nextUrl} />}
      </Helmet>

      <div className='relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-[#f8f8f9] dark:bg-gray-800'>
        <GenreList
          dataGenreComics={dataGenreComics as dataGenres}
          type={type}
          queryConfig={queryConfig}
        />

      </div>

      <div className='container px-4 xl:px-0'>
        <div className='mt-8 flex items-center justify-between h-9'>
          <h2 className='capitalize font-semibold text-black dark:text-white text-base sm:text-2xl'>
            <strong className='text-primary'>Thể loại</strong>
            <span className='hidden md:inline-block'> - trang {queryConfig.page}</span>
          </h2>
          {totalPage && (
            <MiniPagination
              queryConfig={queryConfig}
              page={Number(queryConfig.page)}
              totalPage={totalPage}
            />
          )}
        </div>
        <div className='mt-6 sm:mt-8 min-h-[600px]'>
          <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 xl:gap-4'>
            {dataComics ? (
              dataComics.comics.map((item, index) => (
                <li
                  key={item.id}
                  className='group relative transform hover:scale-[1.02] transition-all duration-200 hover:z-10'
                >
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg' />
                  <CardItem data={item} index={index} />
                </li>
              ))
            ) : (
              <SkeletonListComic />
            )}
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
      </div>
    </>
  )
}

const SkeletonGenre = () => {
  return (
    <>
      {Array(24)
        .fill(0)
        .map((_, i) => (
          <li key={i} className='col-span-1 flex-shrink-0'>
            <div className='min-w-[90px] sm:min-w-[130px] h-[34px] sm:h-[38px] px-3 sm:px-12 py-2 bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse' />
          </li>
        ))}
    </>
  )
}

const SkeletonListComic = () => {
  return (
    <>
      {Array(18)
        .fill(0)
        .map((_, i) => (
          <li
            key={i}
            className='w-full min-h-[280px] sm:min-h-[320px] overflow-hidden animate-pulse rounded-lg bg-white dark:bg-gray-900 shadow-md p-2'
          >
            <div className='flex items-center justify-center w-full h-[200px] sm:h-[240px] lg:h-[220px] bg-gray-200 dark:bg-gray-700 flex-shrink-0 rounded-lg'>
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
            <div className='mt-2 sm:mt-3 flex flex-col px-2'>
              <span className='h-3 sm:h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-[80%] mb-3 sm:mb-4' />
              <span className='h-2.5 sm:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[40%] mb-2' />
              <span className='h-2.5 sm:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[60%]' />
            </div>
          </li>
        ))}
    </>
  )
}

export default ComicsList
