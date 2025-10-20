import PATH from '@/utils/path'
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import {
  HistoryComic,
  historyDeleteComic,
  historyDeleteComics,
  getAllLocalHistory,
  syncReadingHistory
} from '@/utils/history'
import { Helmet } from 'react-helmet-async'

const History = () => {
  const [dataComics, setDataComics] = useState<HistoryComic[]>([])
  const [allHistory, setAllHistory] = useState<HistoryComic[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const ITEMS_PER_PAGE = 16

  // Load all history data once on mount
  const loadAllHistory = useCallback(async () => {
    try {
      setIsInitialLoading(true)
      const history = await getAllLocalHistory()
      setAllHistory(history)

      // Load first page
      const firstPage = history.slice(0, ITEMS_PER_PAGE)
      setDataComics(firstPage)
      setHasMore(history.length > ITEMS_PER_PAGE)
      setPage(0) // Start at 0 since we've loaded the first page (0-15)
    } catch (error) {
      console.error('Error loading history:', error)
      setHasMore(false)
    } finally {
      setIsInitialLoading(false)
    }
  }, [])

  // Load more pages from already loaded data
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Use setTimeout to simulate async and prevent blocking
    setTimeout(() => {
      const nextPage = page + 1
      const skip = nextPage * ITEMS_PER_PAGE
      const nextPageData = allHistory.slice(skip, skip + ITEMS_PER_PAGE)

      if (nextPageData.length > 0) {
        setDataComics((prev) => [...prev, ...nextPageData])
        setPage(nextPage)
        setHasMore(allHistory.length > skip + ITEMS_PER_PAGE)
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 100) // Small delay to prevent rapid-fire calls
  }, [page, allHistory, hasMore, isLoading])

  const handleDeleteComic = async (id: string) => {
    await historyDeleteComic(id)
    // Update both displayed data and all history
    setDataComics((prev) => prev.filter((comic) => Number(comic.id) !== Number(id)))
    setAllHistory((prev) => prev.filter((comic) => Number(comic.id) !== Number(id)))
  }

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa tất cả lịch sử không?')
    if (confirmed) {
      await historyDeleteComics()
      setDataComics([])
      setAllHistory([])
      setHasMore(false)
    }
  }

  const handleSync = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    try {
      setIsSyncing(true)
      await syncReadingHistory(token)
      // Reload all data after sync
      await loadAllHistory()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    loadAllHistory()
  }, [loadAllHistory])

  return (
    <>
      <Helmet>
        <title>Lịch sử đọc truyện - MeTruyen+</title>
        <meta name='description' content='Lịch sử các bộ truyện bạn đã đọc' />
      </Helmet>
      <div className='container px-2 lg:px-0'>
        <div className='mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between text-black dark:text-white'>
          <div className='flex items-center gap-2'>
            <Link
              to={PATH.home}
              className='flex items-center gap-1 hover:text-primary text-base sm:text-lg'
            >
              Trang chủ{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                aria-hidden='true'
                className='w-4 h-4 sm:w-5 sm:h-5'
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
            <span className='flex items-center gap-1 text-base sm:text-lg'>Lịch sử</span>
          </div>
          <div className='flex flex-wrap sm:flex-nowrap items-center gap-2'>
            {localStorage.getItem('auth_token') && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className='flex-1 sm:flex-none text-sm sm:text-base active:scale-90 border border-gray-500 dark:border-gray-400 
                  hover:bg-primary hover:text-white 
                  dark:hover:bg-primary dark:hover:text-white 
                  transition-colors duration-200 
                  px-3 py-1.5 sm:py-1 rounded-md flex items-center justify-center gap-1.5 focus:outline-none'
              >
                {isSyncing ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3' />
                  </svg>
                )}
                <span className='sm:hidden'>Đồng bộ</span>
                <span className='hidden sm:inline'>Đồng bộ với app MeTruyen+</span>
              </button>
            )}
            <button
              onClick={handleDeleteAll}
              className='flex-1 sm:flex-none text-sm sm:text-base active:scale-90 border border-gray-500 dark:border-gray-400 
                hover:bg-primary hover:text-white 
                dark:hover:bg-primary dark:hover:text-white 
                transition-colors duration-200 
                px-3 py-1.5 sm:py-1 rounded-md focus:outline-none'
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        <div className='mt-4 sm:mt-8 min-h-[550px]'>
          {isInitialLoading && (
            <div className='flex justify-center items-center h-[550px]'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          )}
          {!isInitialLoading && dataComics && dataComics.length > 0 && (
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 lg:gap-6`}>
                {dataComics.map((item) => (
                  <div
                    key={item.id}
                    className='col-span-1 sm:col-span-12 md:col-span-6 p-2 sm:p-3 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] rounded-lg'
                  >
                    <div className='flex text-black dark:text-white'>
                      <Link
                        to={`${PATH.comics}/${item.slug_comic}-${item.id}`}
                        title={item.title}
                        className='flex-shrink-0'
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          title={item.title}
                          loading='lazy'
                          className='w-[100px] sm:w-[140px] h-[133px] sm:h-[186px] object-cover rounded-md'
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = imgError
                          }}
                        />
                      </Link>
                      <div className='pl-3 sm:pl-4 flex flex-col flex-1'>
                        <Link
                          to={`${PATH.comics}/${item.slug_comic}-${item.id}`}
                          className='text-sm sm:text-base text-black hover:text-primary dark:text-white dark:hover:text-primary font-bold leading-tight line-clamp-2'
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                        <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2'>
                          {item.time}
                        </span>
                        <p className='mt-2 sm:mt-3'>
                          <Link
                            to={`${PATH.comics}/${item.slug_comic}-${item.id}/${item.slug_chapter}/${item.chapter_id}`}
                            title={item.last_reading}
                            className='text-sm sm:text-base text-primary hover:text-primary/80'
                          >
                            {item.last_reading}
                          </Link>
                        </p>
                        <div className='flex gap-2 mt-auto pt-2 sm:pt-4'>
                          <Link
                            title={item.last_reading}
                            to={`${PATH.comics}/${item.slug_comic}-${item.id}/${item.slug_chapter}/${item.chapter_id}`}
                            className='flex-1 text-sm sm:text-base bg-[#4b8fd7] hover:bg-[#4b8fd7]/90 text-white rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-center active:scale-95 transition-transform'
                          >
                            Đọc tiếp
                          </Link>
                          <button
                            onClick={() => handleDeleteComic(item.id)}
                            className='flex-1 text-sm sm:text-base border-primary hover:bg-primary/10 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-center border text-primary active:scale-95 transition-transform focus:outline-none'
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className='mt-8 text-center'>
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className='inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        Đang tải...
                      </>
                    ) : (
                      'Xem thêm'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
          {!isInitialLoading && Array.isArray(dataComics) && !dataComics.length && (
            <h3 className='flex items-center justify-center text-xl sm:text-2xl h-[550px] text-black dark:text-white'>
              Không tìm thấy lịch sử
            </h3>
          )}
        </div>
      </div>
    </>
  )
}

export default History
