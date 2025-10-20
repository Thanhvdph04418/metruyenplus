import comicApis from '@/apis/comicApis'
import { formatCurrency } from '@/utils/formatNumber'
import classNames from 'classnames'
import { useState, useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import imgLoading from '/loading.gif'
import avatarError from '/anonymous.webp'
import { Comment } from '@/types/data'
import dayjs from 'dayjs'
import { CommentInput } from './CommentInput'

type SortType = 'createdAt' | 'hot'

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const ListComment = ({ id, chapterNumber }: { id: string; chapterNumber?: number }) => {
  const el = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState<number>(1)
  const [sortBy, setSortBy] = useState<SortType>('createdAt')
  const [replyToComment, setReplyToComment] = useState<string | null>(null)

  const customerInfo = localStorage.getItem('customerInfo')
    ? JSON.parse(localStorage.getItem('customerInfo') || '')
    : null
  const token = localStorage.getItem('auth_token')

  useEffect(() => {
    setPage(1)
  }, [id, sortBy])

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ['comic_comment', id, { page, sortBy }],
    queryFn: () => comicApis.getComicComments(id as string, { page, sortBy }),
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true,
    enabled: id !== ''
  })
  const dataComment = data?.data

  const nextPage = () => {
    if (dataComment && page < dataComment.total_pages) {
      setPage((prev) => prev + 1)
    }
    if (el.current) {
      window.scroll({
        behavior: 'smooth',
        top: el.current.offsetTop
      })
    }
  }
  const PrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
    if (el.current) {
      window.scroll({
        behavior: 'smooth',
        top: el.current.offsetTop
      })
    }
  }

  const convertTimestampToText = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes} phút trước`
    } else if (hours < 24) {
      return `${hours} giờ trước`
    } else if (days < 7) {
      return `${days} ngày trước`
    } else {
      // Format as DD-MM-YYYY hh:mm:ss for dates older than a month
      return dayjs(timestamp).format('DD-MM-YYYY HH:mm:ss')
    }
  }

  const handleReply = (commentId: string) => {
    setReplyToComment(commentId)
  }

  const handleCancelReply = () => {
    setReplyToComment(null)
  }

  const handleToggleLike = async (commentId: string) => {
    if (!token || !customerInfo) {
      alert('Vui lòng đăng nhập để thích bình luận')
      return
    }

    try {
      await comicApis.toggleLikeComment({
        token,
        commentId
      })
      refetch()
    } catch (error) {
      console.error(error)
      alert('Thất bại khi thích bình luận')
    }
  }

  return (
    <div className='w-full h-full max-w-[1000px] mx-auto px-2 sm:px-4' ref={el}>
      <div className='border dark:border-gray-500 rounded-lg shadow-sm bg-white dark:bg-gray-800'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border-b dark:border-gray-500'>
          <div className='flex items-center justify-between w-full sm:w-auto gap-2'>
            <h2 className='flex items-center gap-1.5 text-primary font-medium text-base sm:text-xl'>
              Bình luận
              <span className='text-gray-400 text-xs sm:text-sm'>
                ({formatCurrency(dataComment?.total_comments || 0)})
              </span>
            </h2>

            {/* Pagination for desktop */}
            {!isError && (
              <div className='hidden sm:flex items-center gap-1.5'>
                <span className='text-gray-400 text-sm'>
                  <strong className='text-primary'>{page}</strong>/{dataComment?.total_pages}
                </span>
                <div className='flex items-center gap-1'>
                  <button
                    title='Trước'
                    onClick={PrevPage}
                    className={classNames(
                      'p-1 rounded border dark:border-gray-600 flex justify-center active:scale-95',
                      {
                        'opacity-50 cursor-default': page === 1,
                        'hover:border-primary hover:text-primary': page !== 1
                      }
                    )}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-3.5 h-3.5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 19.5L8.25 12l7.5-7.5'
                      />
                    </svg>
                  </button>
                  <button
                    title='Sau'
                    onClick={nextPage}
                    className={classNames(
                      'p-1 rounded border dark:border-gray-600 flex justify-center active:scale-95',
                      {
                        'opacity-50 cursor-default': dataComment?.total_pages === page,
                        'hover:border-primary hover:text-primary': dataComment?.total_pages !== page
                      }
                    )}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-3.5 h-3.5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M8.25 4.5l7.5 7.5-7.5 7.5'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Tab Bar */}
          <div className='w-full mt-2 sm:hidden'>
            <div className='grid grid-cols-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-full gap-1 text-[13px]'>
              <button
                onClick={() => setSortBy('createdAt')}
                className={classNames(
                  'flex items-center justify-center gap-1 py-1.5 px-2 rounded-full transition-colors',
                  sortBy === 'createdAt'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>
                Mới nhất
              </button>
              <button
                onClick={() => setSortBy('hot')}
                className={classNames(
                  'flex items-center justify-center gap-1 py-1.5 px-2 rounded-full transition-colors',
                  sortBy === 'hot'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z'
                  />
                </svg>
                Nổi bật
              </button>
            </div>
          </div>

          {/* Desktop Filter */}
          <div className='hidden sm:flex items-center gap-4'>
            <div className='flex items-center border dark:border-gray-600 rounded-lg overflow-hidden text-sm'>
              <button
                onClick={() => setSortBy('createdAt')}
                className={classNames(
                  'px-3 py-1.5 transition-colors',
                  sortBy === 'createdAt'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <div className='flex items-center gap-1.5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                  Mới nhất
                </div>
              </button>
              <button
                onClick={() => setSortBy('hot')}
                className={classNames(
                  'px-3 py-1.5 transition-colors border-l dark:border-gray-600',
                  sortBy === 'hot'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <div className='flex items-center gap-1.5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z'
                    />
                  </svg>
                  Nổi bật
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Update CommentInput section */}
        <div className='border-b dark:border-gray-500'>
          <CommentInput
            comicId={Number(id)}
            chapterNumber={chapterNumber}
            onCommentAdded={async () => {
              setPage(1)
              await refetch()
            }}
          />
        </div>

        {/* Mobile Pagination */}
        {!isError && (
          <div className='flex sm:hidden items-center justify-between px-2 py-1.5 border-b dark:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50'>
            <span className='text-gray-400 text-xs'>
              Trang <strong className='text-primary'>{page}</strong> / {dataComment?.total_pages}
            </span>
            <div className='flex items-center gap-1'>
              <button
                title='Trước'
                onClick={PrevPage}
                className={classNames(
                  'p-1 rounded border dark:border-gray-600 flex justify-center active:scale-95',
                  {
                    'opacity-50 cursor-default': page === 1,
                    'hover:border-primary hover:text-primary': page !== 1
                  }
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3.5 h-3.5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </button>
              <button
                title='Sau'
                onClick={nextPage}
                className={classNames(
                  'p-1 rounded border dark:border-gray-600 flex justify-center active:scale-95',
                  {
                    'opacity-50 cursor-default': dataComment?.total_pages === page,
                    'hover:border-primary hover:text-primary': dataComment?.total_pages !== page
                  }
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3.5 h-3.5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className='p-2.5 sm:p-4'>
          {isFetching && (
            <div className='h-[300px] border-b dark:border-gray-500 mb-5 border-dashed flex items-center justify-center gap-2'>
              <img src={imgLoading} alt='loading' loading='lazy' />
              <span className='text-gray-400'>Loading...</span>
            </div>
          )}
          {isError && (
            <div className='h-[100px] dark:border-gray-500 border-b mb-5 border-dashed flex items-center justify-center gap-2'>
              <span className='text-gray-400'>Không tìm thấy bình luận</span>
            </div>
          )}
          {!isFetching && dataComment && dataComment.comments.length > 0 && (
            <ul className='space-y-3 sm:space-y-4'>
              {dataComment.comments.map((item: Comment) => (
                <li key={item._id} className='animate-fadeIn'>
                  <div className='flex gap-2 sm:gap-3'>
                    {item.customerInfo.avatar ? (
                      <img
                        src={item.customerInfo.avatar}
                        title={item.customerInfo.name}
                        alt={item.customerInfo.name}
                        className='flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 object-cover rounded-full'
                        loading='lazy'
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = avatarError
                        }}
                      />
                    ) : (
                      <div
                        className='flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-medium'
                        style={{ backgroundColor: item.customerInfo.colorProfile }}
                      >
                        {getInitial(item.customerInfo.name)}
                      </div>
                    )}
                    <div className='flex-1 border-b border-dashed dark:border-gray-500 pb-3 sm:pb-4'>
                      <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                        <span
                          className='font-medium text-black dark:text-white text-sm sm:text-base'
                          style={{ color: item.customerInfo.colorProfile }}
                        >
                          {item.customerInfo.name}
                        </span>
                        {item.chapterInfo && (
                          <span className='text-[11px] sm:text-sm text-primary bg-primary/10 px-1.5 py-0.5 rounded-full'>
                            {item.chapterInfo.name}
                          </span>
                        )}
                      </div>

                      <p className='mt-1 sm:mt-1.5 text-black/80 dark:text-gray-300 break-all break-words whitespace-pre-wrap text-[13px] sm:text-sm'>
                        {item.content.text}
                      </p>

                      {item.content.gif && (
                        <div className='mt-1.5 sm:mt-2 max-w-[45px] sm:max-w-[60px]'>
                          <img
                            src={item.content.gif}
                            alt='gif'
                            title='gif'
                            className='w-full h-auto rounded'
                            loading='lazy'
                          />
                        </div>
                      )}

                      <div className='flex items-center justify-between mt-2 sm:mt-3'>
                        <span className='text-gray-500 text-[11px] sm:text-sm'>
                          {convertTimestampToText(item.createdAt)}
                        </span>
                        <div className='flex items-center gap-2 sm:gap-3 text-gray-500'>
                          <div className='flex items-center'>
                            <button
                              onClick={() => handleToggleLike(item._id)}
                              className={classNames(
                                'flex items-center gap-1 text-sm transition-colors font-medium',
                                item.content.likes?.customerIds?.includes(customerInfo?.id)
                                  ? 'text-primary'
                                  : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
                              )}
                            >
                              {item.content.likes?.customerIds?.includes(customerInfo?.id) ? (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 24 24'
                                  fill='currentColor'
                                  className='w-4 h-4'
                                >
                                  <path d='M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z' />
                                </svg>
                              ) : (
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='w-4 h-4'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z'
                                  />
                                </svg>
                              )}
                              {item.content.likes?.count || 0}
                            </button>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              className='w-4 h-4 sm:w-5 sm:h-5'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                              />
                            </svg>
                            <span className='ml-0.5 text-xs sm:text-sm'>
                              {item.replies && item.replies.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.replies && item.replies.length > 0 && (
                        <div className='mt-2 sm:mt-3 space-y-2 sm:space-y-3'>
                          {item.replies.map((reply) => (
                            <div
                              key={reply._id}
                              className='p-2 sm:p-3 flex gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-800/50 rounded'
                            >
                              {reply.customerInfo.avatar ? (
                                <img
                                  src={reply.customerInfo.avatar}
                                  alt={reply.customerInfo.name}
                                  title={reply.customerInfo.name}
                                  className='flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-full'
                                  loading='lazy'
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null
                                    currentTarget.src = avatarError
                                  }}
                                />
                              ) : (
                                <div
                                  className='flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium'
                                  style={{ backgroundColor: reply.customerInfo.colorProfile }}
                                >
                                  {getInitial(reply.customerInfo.name)}
                                </div>
                              )}
                              <div className='flex-1'>
                                <span
                                  className='font-medium text-black dark:text-white text-[13px] sm:text-sm'
                                  style={{ color: reply.customerInfo.colorProfile }}
                                >
                                  {reply.customerInfo.name}
                                </span>
                                <p className='mt-1 text-black/80 dark:text-gray-300 break-words text-[13px] sm:text-sm'>
                                  {reply.content.text}
                                </p>
                                {reply.content.gif && (
                                  <div className='mt-1.5 max-w-[40px] sm:max-w-[50px]'>
                                    <img
                                      src={reply.content.gif}
                                      title='gif'
                                      alt='gif'
                                      className='w-full h-auto rounded'
                                      loading='lazy'
                                    />
                                  </div>
                                )}
                                <span className='block mt-1.5 text-gray-500 text-[11px] sm:text-xs'>
                                  {convertTimestampToText(reply.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add reply button */}
                      <div className='flex items-center gap-2 mt-2'>
                        <button
                          onClick={() => handleReply(item._id)}
                          className='flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-medium'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-4 h-4'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
                            />
                          </svg>
                          Trả lời
                        </button>
                      </div>

                      {/* Show reply input when replying to this comment */}
                      {replyToComment === item._id && (
                        <div className='mt-3'>
                          <CommentInput
                            comicId={Number(id)}
                            chapterNumber={item.chapterInfo?.chapterId}
                            parentCommentId={item._id}
                            onCommentAdded={() => {
                              refetch()
                              handleCancelReply()
                            }}
                            onCancel={handleCancelReply}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
export default ListComment
