import { Link } from 'react-router-dom'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaUserPlus, FaUserCheck } from 'react-icons/fa'
import PATH from '@/utils/path'

export interface LastReadChapter {
  id: number
  name: string
  slug_chapter: string
}

export interface FirstChapter {
  id: number
  name: string
  slug_chapter: string
}

export interface ComicActionsBarProps {
  isFollowing: boolean
  isFollowed: boolean
  isLiking: boolean
  isLiked: boolean
  onFollow: () => void
  onLike: () => void
  onDownload: () => void
  isAuthenticated: boolean
  hasChapters: boolean
  lastReadChapter?: LastReadChapter | null
  firstChapter?: FirstChapter
  comicSlug: string
  comicId: string
}

/**
 * ComicActionsBar - Action buttons (Follow, Like, Download, Share)
 * Pure presentational component for comic action buttons
 */
export const ComicActionsBar = ({
  isFollowing,
  isFollowed,
  isLiking,
  isLiked,
  onFollow,
  onLike,
  hasChapters,
  lastReadChapter,
  firstChapter,
  comicSlug,
  comicId
}: ComicActionsBarProps) => {
  const getReadButtonUrl = () => {
    if (!hasChapters || !firstChapter) return '#'
    const chapter = lastReadChapter || firstChapter
    return `${PATH.comics}/${comicSlug}-${comicId}/${chapter.slug_chapter}/${chapter.id}`
  }

  const getReadButtonText = () => {
    if (lastReadChapter) {
      return `Đọc tiếp ${lastReadChapter.name}`
    }
    return 'Đọc Ngay'
  }

  return (
    <>
      <div className='flex items-center justify-center sm:justify-start gap-3 mt-4 sm:mt-2'>
        {hasChapters ? (
          <Link
            title={
              lastReadChapter ? `Đọc tiếp ${lastReadChapter.name}` : 'Đọc ngay chương mới nhất'
            }
            to={getReadButtonUrl()}
            className={`text-white flex-shrink-0 w-full sm:w-auto min-w-[180px] h-[42px] sm:h-[42px] capitalize font-semibold flex items-center justify-center rounded gap-2 px-4 hover:text-white ${
              lastReadChapter
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                : 'bg-gradient'
            }`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              aria-hidden='true'
              className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0'
              viewBox='0 0 32 32'
            >
              <path
                fill='currentColor'
                d='M19 10h7v2h-7zm0 5h7v2h-7zm0 5h7v2h-7zM6 10h7v2H6zm0 5h7v2H6zm0 5h7v2H6z'
              />
              <path
                fill='currentColor'
                d='M28 5H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.002 2.002 0 0 0 2-2V7a2.002 2.002 0 0 0-2-2ZM4 7h11v18H4Zm13 18V7h11v18Z'
              />
            </svg>
            <span className='truncate text-sm sm:text-base'>{getReadButtonText()}</span>
          </Link>
        ) : (
          <button
            disabled
            className='text-white flex-shrink-0 w-full sm:w-auto min-w-[180px] h-[42px] sm:h-[42px] capitalize font-semibold flex items-center justify-center rounded gap-2 px-4 bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
            title='Truyện chưa có chương'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <circle cx='12' cy='12' r='10' />
              <line x1='12' y1='8' x2='12' y2='12' />
              <line x1='12' y1='16' x2='12.01' y2='16' />
            </svg>
            <span className='truncate text-sm sm:text-base'>Chưa có chương</span>
          </button>
        )}

        {/* Follow Button - Desktop */}
        <button
          disabled={isFollowing}
          className={`hidden sm:flex items-center gap-2 h-[42px] px-4 rounded font-medium transition-all duration-200 ${
            isFollowing ? 'opacity-70 cursor-not-allowed' : ''
          } ${
            isFollowed
              ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-blue-300/50 dark:hover:shadow-blue-900/50'
              : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 hover:shadow-sm'
          }`}
          onClick={onFollow}
        >
          {isFollowing ? (
            <svg
              className='animate-spin h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : isFollowed ? (
            <FaUserCheck className='w-5 h-5' />
          ) : (
            <FaUserPlus className='w-5 h-5' />
          )}
          <span>{isFollowed ? 'Đã theo dõi' : 'Theo dõi'}</span>
        </button>

        {/* Like Button - Desktop */}
        <button
          disabled={isLiking}
          className={`hidden sm:flex items-center gap-2 h-[42px] px-4 rounded font-medium transition-all duration-200 ${
            isLiking ? 'opacity-70 cursor-not-allowed' : ''
          } ${
            isLiked
              ? 'bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 shadow-md hover:shadow-rose-300/50 dark:hover:shadow-rose-900/50'
              : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-400 dark:hover:text-rose-400 hover:shadow-sm'
          }`}
          onClick={onLike}
        >
          {isLiking ? (
            <svg
              className='animate-spin h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : isLiked ? (
            <AiFillHeart className='w-5 h-5' />
          ) : (
            <AiOutlineHeart className='w-5 h-5' />
          )}
          <span>{isLiked ? 'Đã thích' : 'Yêu thích'}</span>
        </button>
      </div>

      {/* Mobile Action Buttons */}
      <div className='flex sm:hidden items-center gap-2 mt-3'>
        <button
          disabled={isFollowing}
          className={`flex-1 h-10 flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 ${
            isFollowing ? 'opacity-70 cursor-not-allowed' : ''
          } ${
            isFollowed
              ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-blue-300/50 dark:hover:shadow-blue-900/50'
              : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 hover:shadow-sm'
          }`}
          onClick={onFollow}
        >
          {isFollowing ? (
            <svg
              className='animate-spin h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : isFollowed ? (
            <FaUserCheck className='w-4 h-4' />
          ) : (
            <FaUserPlus className='w-4 h-4' />
          )}
          <span>{isFollowed ? 'Đã theo dõi' : 'Theo dõi'}</span>
        </button>

        <button
          disabled={isLiking}
          className={`flex-1 h-10 flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 ${
            isLiking ? 'opacity-70 cursor-not-allowed' : ''
          } ${
            isLiked
              ? 'bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 shadow-md hover:shadow-rose-300/50 dark:hover:shadow-rose-900/50'
              : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-400 dark:hover:text-rose-400 hover:shadow-sm'
          }`}
          onClick={onLike}
        >
          {isLiking ? (
            <svg
              className='animate-spin h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : isLiked ? (
            <AiFillHeart className='w-4 h-4' />
          ) : (
            <AiOutlineHeart className='w-4 h-4' />
          )}
          <span>{isLiked ? 'Đã thích' : 'Yêu thích'}</span>
        </button>
      </div>
    </>
  )
}
