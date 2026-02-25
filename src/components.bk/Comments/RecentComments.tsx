import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import avatarError from '/anonymous.webp'
import { Comment } from '@/types/data'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { convertToSlug } from '@/utils/slugify'
import PATH from '@/utils/path'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const RecentComments = () => {
  const { data } = useQuery({
    queryKey: ['recent_comments'],
    queryFn: () => comicApis.getRecentComments(),
    staleTime: 3 * 60 * 1000
  })

  const comments = data?.data.slice(0, 7)

  const convertTimestampToText = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days < 7) return `${days} ngày trước`
    return dayjs(timestamp).format('DD-MM-YYYY HH:mm:ss')
  }

  return (
    <div className='bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-light-border dark:border-dark-highlight max-w-full overflow-hidden'>
      <div className='flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Bình luận gần đây</h3>
      </div>

      <div className='p-3 overflow-hidden'>
        <ul className='space-y-3 max-w-full'>
          {comments?.map((item: Comment) => (
            <li key={item._id} className='animate-fadeIn max-w-full overflow-hidden'>
              <div className='flex gap-2 min-w-0 max-w-full'>
                <div className='flex-shrink-0 w-8 h-8'>
                  {item.customerInfo.avatar ? (
                    <LazyLoadImage
                      src={item.customerInfo.avatar}
                      alt={item.customerInfo.name}
                      title={item.customerInfo.name}
                      width='100%'
                      height='100%'
                      placeholderSrc={avatarError}
                      threshold={100}
                      wrapperClassName='block w-8 h-8'
                      className='w-full h-full rounded-full object-cover'
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = avatarError
                      }}
                    />
                  ) : (
                    <div
                      className='w-full h-full rounded-full flex items-center justify-center text-white text-sm font-medium'
                      style={{ backgroundColor: item.customerInfo.colorProfile }}
                    >
                      {getInitial(item.customerInfo.name)}
                    </div>
                  )}
                </div>
                <div className='flex-1 min-w-0 max-w-full border-b border-dashed dark:border-gray-700 pb-3 overflow-hidden'>
                  <div className='flex flex-col gap-1.5'>
                    <span
                      className='font-medium text-sm truncate'
                      style={{ color: item.customerInfo.colorProfile }}
                    >
                      {item.customerInfo.name}
                    </span>
                    <div className='flex items-center gap-2 min-w-0'>
                      <div className='flex-shrink-0'>
                        <LazyLoadImage
                          src={item.comicInfo.thumbnail}
                          alt={item.comicInfo.name}
                          title={item.comicInfo.name}
                          effect='blur'
                          placeholderSrc={avatarError}
                          threshold={100}
                          wrapperClassName='block'
                          className='w-8 h-10 object-cover rounded'
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = avatarError
                          }}
                        />
                      </div>
                      <div className='flex flex-col min-w-0 flex-1 gap-1'>
                        <Link
                          to={`${PATH.comics}/${convertToSlug(item.comicInfo.name)}-${
                            item.comicId
                          }`}
                          className='text-xs text-primary hover:underline truncate'
                          title={item.comicInfo.name}
                        >
                          {item.comicInfo.name}
                        </Link>
                        {item.chapterInfo && (
                          <Link
                            to={`${PATH.comics}/${convertToSlug(item.comicInfo.name)}-${
                              item.comicId
                            }/${convertToSlug(item.chapterInfo?.name || '')}/${item.chapterInfo
                              ?.chapterId}`}
                            className='text-xs text-primary hover:underline truncate'
                            title={item.chapterInfo?.name || ''}
                          >
                            {item.chapterInfo?.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <p
                    className='mt-1 text-sm text-gray-600 dark:text-gray-300 break-words line-clamp-2 overflow-hidden max-w-full'
                    style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}
                  >
                    {item.content.text}
                  </p>

                  {item.content.gif && (
                    <div className='mt-1.5 max-w-[45px] flex-shrink-0'>
                      <img
                        src={item.content.gif}
                        alt='gif'
                        title='gif'
                        className='w-full h-auto rounded'
                        loading='lazy'
                      />
                    </div>
                  )}

                  <div className='flex items-center justify-between mt-2'>
                    <span className='text-xs text-gray-500'>
                      {convertTimestampToText(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RecentComments
