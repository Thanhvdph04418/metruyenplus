import comicApis from '@/apis/comicApis'
import { CardItem, MiniPagination, Pagination } from '@/components'
import { PaginationSkeleton } from '@/components/Skeletons'
import { useQueryConfig, useScrollTop } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import { NotFound } from '@/App'
import { Helmet } from 'react-helmet-async'
import { dataGenres } from '@/types/data'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'

// Smart GenreList with collapsible design
const GenreList = ({
  dataGenreComics,
  type,
  queryConfig
}: {
  dataGenreComics: dataGenres
  type: any
  queryConfig: any
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Get current selected genre name
  const currentGenre = dataGenreComics?.find((item) => item.id === type) || dataGenreComics?.at(0)

  // Show all genres in original order
  const allGenres = dataGenreComics || []
  const hasMoreGenres = dataGenreComics && dataGenreComics.length > 12

  // Filter genres based on search term
  const filteredGenres =
    dataGenreComics?.filter((genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Auto collapse when genre is selected
  const handleGenreSelect = () => {
    setIsExpanded(false)
    setShowAll(false)
    setSearchTerm('')
    setShowSearchResults(false)
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSearchResults(value.length > 0)
  }

  // Handle search result click
  const handleSearchResultClick = (item: any) => {
    setSearchTerm('')
    setShowSearchResults(false)
    // Navigate to the selected genre
    window.location.href = `?${createSearchParams({
      ...queryConfig,
      page: '1',
      type: item.id
    }).toString()}`
  }

  return (
    <div className='w-full max-w-6xl mx-auto'>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
        {/* Selected genre section */}
        {currentGenre && (
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
              Thể loại đang chọn
            </h3>
            <div className='flex items-center gap-2'>
              <span className='px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-md'>
                {currentGenre.name}
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {currentGenre.description}
              </span>
            </div>
          </div>
        )}

        {/* All genres */}
        <div className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Tất cả thể loại</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors'
            >
              <span>{isExpanded ? 'Thu gọn' : 'Xem tất cả'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
          </div>

          {/* Search box */}
          <div className='mb-4 relative'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Tìm kiếm thể loại...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg
                  className='h-4 w-4 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setShowSearchResults(false)
                  }}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {showSearchResults && (
              <div className='absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                {filteredGenres.length > 0 ? (
                  filteredGenres.map((item: any) => (
                    <button
                      key={`search-${item.id}`}
                      onClick={() => handleSearchResultClick(item)}
                      className='w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between'
                    >
                      <span>{item.name}</span>
                      {item.id === type && <span className='text-primary text-xs'>Đang chọn</span>}
                    </button>
                  ))
                ) : (
                  <div className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center'>
                    Không tìm thấy thể loại nào
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All genres grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2'>
            {allGenres ? (
              (showAll ? allGenres : allGenres.slice(0, 12)).map((item: any) => (
                <GenreItem
                  key={item.id}
                  item={item}
                  type={type}
                  queryConfig={queryConfig}
                  onSelect={handleGenreSelect}
                />
              ))
            ) : (
              <SkeletonGenre />
            )}
          </div>

          {/* Show more/less button */}
          {hasMoreGenres && (
            <div className='mt-4 text-center'>
              <button
                onClick={() => setShowAll(!showAll)}
                className='px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white rounded-lg transition-colors'
              >
                {showAll ? 'Thu gọn' : `Xem thêm ${allGenres.length - 12} thể loại`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const GenreItem = ({
  item,
  type,
  queryConfig,
  onSelect
}: {
  item: any
  type: any
  queryConfig: any
  onSelect?: () => void
}) => {
  const isSelected = type === item.id || (!type && item.id === 'all')

  const handleClick = () => {
    if (onSelect) {
      onSelect()
    }
  }

  return (
    <Link
      title={item.name}
      onClick={handleClick}
      className={classNames(
        'block text-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105',
        {
          'bg-primary text-white shadow-md hover:text-white': isSelected,
          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white':
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
    </Link>
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

  // // Derived state
  // const descGenre = useMemo(
  //   () =>
  //     dataGenreComics?.find((item) => item.id === type)?.description ??
  //     dataGenreComics?.at(0)?.description,
  //   [type, dataGenreComics]
  // )

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
        <title>{`Truyện Thể loại ${currentGenre?.name} - Tcomic`}</title>
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

      <div className='container px-4 xl:px-0 py-6'>
        <GenreList
          dataGenreComics={dataGenreComics as dataGenres}
          type={type}
          queryConfig={queryConfig}
        />
      </div>

      <div className='container px-4 xl:px-0'>
        <div className='mt-8 flex items-center justify-between h-9'>
          <h2 className='capitalize font-semibold text-black dark:text-white text-base sm:text-2xl'>
            <strong className='text-primary'>{currentGenre?.name || 'Tất cả'}</strong>
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
        <div className='mt-6'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
            {dataComics ? (
              dataComics.comics.map((item, index) => (
                <CardItem key={item.id} data={item} index={index} />
              ))
            ) : (
              <SkeletonListComic />
            )}
          </div>
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
      {Array(16)
        .fill(0)
        .map((_, i) => (
          <div key={i} className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse' />
        ))}
    </>
  )
}

const SkeletonListComic = () => {
  return (
    <>
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className='bg-white dark:bg-gray-900 rounded-lg shadow-sm p-3 animate-pulse'>
            <div className='w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3' />
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
            </div>
          </div>
        ))}
    </>
  )
}

export default ComicsList
