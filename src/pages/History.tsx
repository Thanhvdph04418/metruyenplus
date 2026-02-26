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
import { SITE_NAME } from '@/config/siteConfig'

const ITEMS_PER_PAGE = 12

const History = () => {
  const [dataComics, setDataComics] = useState<HistoryComic[]>([])
  const [allHistory, setAllHistory] = useState<HistoryComic[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

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

  const totalCount = allHistory.length
  const hasResults = dataComics.length > 0
  const showEmpty = !isInitialLoading && !hasResults

  return (
    <>
      <Helmet>
        <title>{`Lịch sử đọc truyện - ${SITE_NAME}`}</title>
        <meta name='description' content='Lịch sử các bộ truyện bạn đã đọc' />
      </Helmet>
      <div className='min-h-screen bg-white dark:bg-neutral-900'>
        <div className='container max-w-[1100px] px-4 sm:px-6 py-5 sm:py-6'>
          {/* Breadcrumb */}
          <nav className='flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 mb-4'>
            <Link to={PATH.home} className='hover:text-primary transition-colors'>
              Trang chủ
            </Link>
            <span aria-hidden>/</span>
            <span className='text-neutral-700 dark:text-neutral-300 font-medium'>
              Lịch sử đọc truyện
            </span>
          </nav>

          {/* Title + actions */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white'>
                Lịch sử đọc truyện
              </h1>
              {!isInitialLoading && (
                <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-400'>
                  {totalCount > 0
                    ? `${totalCount} truyện đã đọc`
                    : 'Các truyện bạn đã đọc sẽ hiển thị tại đây'}
                </p>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {localStorage.getItem('auth_token') && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className='inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-primary hover:text-white hover:border-primary dark:hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSyncing ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent' />
                  ) : (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3' />
                    </svg>
                  )}
                  <span className='sm:hidden'>Đồng bộ</span>
                  <span className='hidden sm:inline'>Đồng bộ với app</span>
                </button>
              )}
              <button
                onClick={handleDeleteAll}
                disabled={!hasResults && totalCount === 0}
                className='inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:border-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='min-h-[400px]'>
            {isInitialLoading && <HistorySkeleton />}
            {!isInitialLoading && hasResults && (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                  {dataComics.map((item) => (
                    <article
                      key={item.id}
                      className='flex gap-3 sm:gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors'
                    >
                      <Link
                        to={`${PATH.comics}/${item.slug_comic}-${item.id}`}
                        title={item.title}
                        className='flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/5'
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          width={100}
                          height={133}
                          loading='lazy'
                          className='w-[100px] sm:w-[120px] h-[133px] sm:h-[160px] object-cover'
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = imgError
                          }}
                        />
                      </Link>
                      <div className='flex flex-col flex-1 min-w-0'>
                        <Link
                          to={`${PATH.comics}/${item.slug_comic}-${item.id}`}
                          className='font-semibold text-neutral-900 dark:text-white line-clamp-2 text-[15px] leading-snug hover:text-primary'
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                        <span className='text-xs text-neutral-500 dark:text-neutral-400 mt-0.5'>
                          {item.time}
                        </span>
                        <Link
                          to={`${PATH.comics}/${item.slug_comic}-${item.id}/${item.slug_chapter}/${item.chapter_id}`}
                          title={item.last_reading}
                          className='text-sm text-primary hover:underline line-clamp-1 mt-1'
                        >
                          {item.last_reading}
                        </Link>
                        <div className='flex gap-2 mt-auto pt-3'>
                          <Link
                            to={`${PATH.comics}/${item.slug_comic}-${item.id}/${item.slug_chapter}/${item.chapter_id}`}
                            className='flex-1 text-center text-sm font-medium py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors'
                          >
                            Đọc tiếp
                          </Link>
                          <button
                            type='button'
                            onClick={() => handleDeleteComic(item.id)}
                            className='flex-1 text-sm font-medium py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors'
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {hasMore && (
                  <div className='mt-8 flex justify-center'>
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className='inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isLoading ? (
                        <>
                          <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
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
            {showEmpty && (
              <div className='flex flex-col items-center justify-center min-h-[400px] text-center px-4'>
                <div className='w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-8 h-8 text-neutral-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <p className='text-lg font-medium text-neutral-800 dark:text-white'>
                  Chưa có lịch sử đọc
                </p>
                <p className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
                  Truyện bạn đọc sẽ được lưu tại đây
                </p>
                <Link
                  to={PATH.home}
                  className='mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:underline'
                >
                  Khám phá truyện →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function HistorySkeleton() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse'>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className='flex gap-3 sm:gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40'>
            <div className='w-[100px] sm:w-[120px] h-[133px] sm:h-[160px] bg-neutral-200 dark:bg-neutral-700 rounded-lg flex-shrink-0' />
            <div className='flex-1 min-w-0 space-y-2'>
              <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5' />
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16' />
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full' />
              <div className='flex gap-2 pt-2'>
                <div className='h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-20' />
                <div className='h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-14' />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default History
