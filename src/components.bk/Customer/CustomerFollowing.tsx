import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import imgError from '/img-error.webp'
import comicApis from '@/apis/comicApis'
import type { ResultListFollowComic } from '@/types/data'

const ITEMS_PER_PAGE = 30

const CustomerFollowing = () => {
  const [dataComics, setDataComics] = useState<ResultListFollowComic['data']>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const token = localStorage.getItem('auth_token')

  const loadFollowingComics = async (pageNum: number) => {
    try {
      if (!token) return
      const response = await comicApis.getListFollowComic(token, pageNum, ITEMS_PER_PAGE)
      if (response.code === 0) {
        setDataComics((prev) => {
          const newComics = response.data.filter(
            (comic) => !prev.some((p) => p.comicId === comic.comicId)
          )
          return [...prev, ...newComics]
        })
        setHasMore(pageNum < response.total_pages)
      }
    } catch (error) {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setDataComics([])
    setPage(1)
    return () => {
      setDataComics([])
      setPage(1)
    }
  }, [])

  useEffect(() => {
    loadFollowingComics(page)
  }, [page, token])

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      setPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading])

  if (loading && dataComics.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <div className='relative mb-4'>
          <div className='w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700'></div>
          <div className='absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin'></div>
        </div>
        <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
          Đang tải truyện theo dõi...
        </p>
      </div>
    )
  }

  if (!loading && dataComics.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 px-4'>
        <div className='w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-50 dark:ring-gray-900'>
          <svg
            className='w-10 h-10 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
          Chưa có truyện theo dõi
        </h3>
        <p className='text-gray-500 dark:text-gray-400 text-center max-w-sm leading-relaxed'>
          Khám phá và theo dõi những bộ truyện yêu thích để xem chúng xuất hiện ở đây
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-5'>
        {dataComics.map((comic) => (
          <div
            key={comic.comicId}
            className='group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 will-change-transform'
          >
            <div className='aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-700 rounded-t-xl relative'>
              <Link
                to={`${PATH.comics}/${comic.comicInfo.slug}-${comic.comicInfo.id}`}
                title={comic.comicInfo.name}
                className='block w-full h-full'
              >
                <img
                  src={comic.comicInfo.thumbnailUrl}
                  title={comic.comicInfo.name}
                  alt={comic.comicInfo.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
                  loading='lazy'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = imgError
                  }}
                />
                {/* Hover overlay */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
              </Link>
            </div>
            <div className='p-3 bg-gradient-to-t from-white to-white dark:from-gray-800 dark:to-gray-800'>
              <Link
                to={`${PATH.comics}/${comic.comicInfo.slug}-${comic.comicInfo.id}`}
                title={comic.comicInfo.name}
                className='block font-semibold text-gray-900 dark:text-white text-sm leading-5 line-clamp-2 hover:text-primary transition-colors duration-200 group-hover:scale-[1.02] transform origin-left'
              >
                {comic.comicInfo.name}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className='flex flex-col items-center justify-center py-8'>
          <div className='relative'>
            <div className='w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700'></div>
            <div className='absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin'></div>
          </div>
          <p className='mt-3 text-xs text-gray-400 dark:text-gray-500'>Đang tải thêm...</p>
        </div>
      )}
    </div>
  )
}

export default CustomerFollowing
