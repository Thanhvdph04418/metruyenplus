import avatarError from '/anonymous.webp'
import { Comment } from '@/types/data'
import { Link } from 'react-router-dom'
import { convertToSlug } from '@/utils/slugify'
import PATH from '@/utils/path'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { formatRelativeTime } from '@/utils/formatters'

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

interface RecentCommentItemProps {
  comment: Comment
}

const RecentCommentItem = ({ comment }: RecentCommentItemProps) => {
  return (
    <li className='animate-fadeIn max-w-full overflow-hidden'>
      <div className='flex gap-2 min-w-0 max-w-full'>
        <div className='flex-shrink-0 w-8 h-8'>
          {comment.customerInfo.avatar ? (
            <LazyLoadImage
              src={comment.customerInfo.avatar}
              alt={comment.customerInfo.name}
              title={comment.customerInfo.name}
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
              style={{ backgroundColor: comment.customerInfo.colorProfile }}
            >
              {getInitial(comment.customerInfo.name)}
            </div>
          )}
        </div>
        <div className='flex-1 min-w-0 max-w-full border-b border-dashed dark:border-gray-700 pb-3 overflow-hidden'>
          <div className='flex flex-col gap-1.5'>
            <span
              className='font-medium text-sm truncate'
              style={{ color: comment.customerInfo.colorProfile }}
            >
              {comment.customerInfo.name}
            </span>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='flex-shrink-0'>
                <LazyLoadImage
                  src={comment.comicInfo.thumbnail}
                  alt={comment.comicInfo.name}
                  title={comment.comicInfo.name}
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
                  to={`${PATH.comics}/${convertToSlug(comment.comicInfo.name)}-${comment.comicId}`}
                  className='text-xs text-primary hover:underline truncate'
                  title={comment.comicInfo.name}
                >
                  {comment.comicInfo.name}
                </Link>
                {comment.chapterInfo && (
                  <Link
                    to={`${PATH.comics}/${convertToSlug(comment.comicInfo.name)}-${
                      comment.comicId
                    }/${convertToSlug(comment.chapterInfo?.name || '')}/${comment.chapterInfo
                      ?.chapterId}`}
                    className='text-xs text-primary hover:underline truncate'
                    title={comment.chapterInfo?.name || ''}
                  >
                    {comment.chapterInfo?.name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <p
            className='mt-1 text-sm text-gray-600 dark:text-gray-300 break-words line-clamp-2 overflow-hidden max-w-full'
            style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}
          >
            {comment.content.text}
          </p>

          {comment.content.gif && (
            <div className='mt-1.5 max-w-[45px] flex-shrink-0'>
              <img
                src={comment.content.gif}
                alt='gif'
                title='gif'
                className='w-full h-auto rounded'
                loading='lazy'
              />
            </div>
          )}

          <div className='flex items-center justify-between mt-2'>
            <span className='text-xs text-gray-500'>
              {formatRelativeTime(new Date(comment.createdAt))}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default RecentCommentItem
