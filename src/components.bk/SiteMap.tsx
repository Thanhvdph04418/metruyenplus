import { Link, createSearchParams } from 'react-router-dom'
import PATH from '@/utils/path'
import { genres } from '@/constants/genres'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

const SiteMap = () => {
  // Split genres into columns for better layout
  const genreColumns = useMemo(() => {
    const columns = []
    const itemsPerColumn = Math.ceil(genres.length / 3)

    for (let i = 0; i < genres.length; i += itemsPerColumn) {
      columns.push(genres.slice(i, i + itemsPerColumn))
    }

    return columns
  }, [])

  return (
    <>
      <Helmet>
        <title>Sơ đồ trang web - nettruyen</title>
        <meta
          name='description'
          content='Sơ đồ trang web của nettruyen - Tất cả các đường dẫn trên website'
        />
        <link rel='canonical' href='https://nettruyen.com/so-do-trang-web' />
      </Helmet>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/30 overflow-hidden'>
          {/* Header Section */}
          <div className='relative bg-gradient-to-r from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-850 p-8 sm:p-12'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center'>
              Sơ Đồ Trang Web
            </h1>
            <div className='absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02]' />
          </div>

          {/* Main Content */}
          <div className='p-4 sm:p-8 dark:bg-gray-900'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
              {/* Main Navigation */}
              <div className='group p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200'>
                <h2 className='flex items-center font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  <span className='mr-2'>📍</span> Điều Hướng
                </h2>
                <ul className='space-y-3'>
                  <li>
                    <Link
                      to={PATH.home}
                      title='Trang chủ'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: PATH.recent,
                        search: createSearchParams({
                          page: '1'
                        }).toString()
                      }}
                      title='Mới cập nhật'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Mới cập nhật
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: PATH.popular,
                        search: createSearchParams({
                          page: '1'
                        }).toString()
                      }}
                      title='Truyện nổi bật'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Truyện nổi bật
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: PATH.completed,
                        search: createSearchParams({
                          page: '1'
                        }).toString()
                      }}
                      title='Đã hoàn thành'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Đã hoàn thành
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Rankings */}
              <div className='group p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200'>
                <h2 className='flex items-center font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  <span className='mr-2'>🏆</span> Bảng Xếp Hạng
                </h2>
                <ul className='space-y-3'>
                  <li>
                    <Link
                      to={`${PATH.top}${PATH.daily}`}
                      title='Top ngày'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Top ngày
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${PATH.top}${PATH.weekly}`}
                      title='Top tuần'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Top tuần
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${PATH.top}${PATH.monthly}`}
                      title='Top tháng'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Top tháng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={PATH.boy}
                      title='Truyện con trai'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Truyện con trai
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={PATH.girl}
                      title='Truyện con gái'
                      className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                    >
                      Truyện con gái
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Genres */}
              <div className='group lg:col-span-2 p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-md dark:hover:shadow-gray-900/30 transition-all duration-200'>
                <h2 className='flex items-center font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  <span className='mr-2'>📚</span> Thể Loại
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4'>
                  {genreColumns.map((column, columnIndex) => (
                    <ul key={columnIndex} className='space-y-3'>
                      {column.map((genre) => (
                        <li key={genre.id}>
                          <Link
                            to={{
                              pathname: PATH.genres,
                              search: createSearchParams({
                                type: genre.id,
                                page: '1'
                              }).toString()
                            }}
                            title={`Thể loại ${genre.name}`}
                            className='flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-all duration-200 hover:translate-x-2 group-hover:opacity-90'
                          >
                            <span className='mr-2'>•</span>
                            {genre.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className='mt-12 pt-6 border-t border-gray-200 dark:border-gray-700/50'>
              <ul className='flex flex-wrap items-center gap-x-8 gap-y-4 text-sm justify-center'>
                <li>
                  <Link
                    to={PATH.privatePolicy}
                    title='Chính sách bảo mật'
                    className='flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-colors'
                  >
                    <span className='mr-2'>🔒</span>
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <a
                    href='mailto:support@nettruyenstore.com'
                    title='Liên hệ'
                    className='flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary/90 transition-colors'
                  >
                    <span className='mr-2'>✉️</span>
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SiteMap
