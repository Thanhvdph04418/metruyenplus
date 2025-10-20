import { useState, useCallback, useRef, useEffect } from 'react'
import { Comment } from '@/types/data'
import comicApis from '@/apis/comicApis'
import classNames from 'classnames'

interface CommentInputProps {
  comicId: number
  chapterNumber?: number
  onCommentAdded: (comment: Comment) => void
  parentCommentId?: string
  onCancel?: () => void
}

export function CommentInput({
  comicId,
  chapterNumber,
  onCommentAdded,
  parentCommentId,
  onCancel
}: CommentInputProps) {
  const [content, setContent] = useState('')
  const [selectedGif, setSelectedGif] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [gifData, setGifData] = useState<any[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const token = localStorage.getItem('auth_token')
  const customerInfo = localStorage.getItem('customerInfo')
    ? JSON.parse(localStorage.getItem('customerInfo') || '')
    : null

  useEffect(() => {
    fetch('/data/gifs.json')
      .then((res) => res.json())
      .then((data) => setGifData(data))
      .catch((error) => console.error('Error loading GIF data:', error))
  }, [])

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category))
  }

  const handleGifSelect = useCallback((gifUrl: string) => {
    setSelectedGif(gifUrl)
    setActiveCategory(null)
  }, [])

  const handleSubmit = async () => {
    if (!token || !customerInfo) {
      alert('Vui lòng đăng nhập để bình luận')
      return
    }

    if (!content.trim() && !selectedGif) {
      return
    }

    setIsSubmitting(true)

    try {
      let response
      if (parentCommentId) {
        response = await comicApis.addReplyComment({
          token,
          commentId: parentCommentId,
          content: content.trim(),
          gifUrl: selectedGif || undefined
        })
      } else {
        response = await comicApis.addCommentComic({
          token,
          comicId,
          chapterNumber,
          content: content.trim(),
          gifUrl: selectedGif || undefined
        })
      }
      onCommentAdded(response as unknown as Comment)
      setContent('')
      setSelectedGif(null)
      onCancel?.()
    } catch (error) {
      console.error(error)
      alert('Thất bại khi thêm bình luận')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className='text-center p-4 text-gray-500 dark:text-gray-400'>
        Vui lòng đăng nhập để bình luận
      </div>
    )
  }

  return (
    <div
      className='space-y-3 p-3 sm:p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-all'
      ref={dialogRef}
    >
      {parentCommentId && (
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>Đang trả lời bình luận</span>
          <button
            onClick={onCancel}
            className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          >
            Hủy
          </button>
        </div>
      )}

      {/* GIF Category Preview - Always visible */}
      <div className='flex overflow-x-auto gap-2 pb-2 border-b dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
        {gifData.map((category: any) => (
          <button
            key={category.category}
            onClick={() => handleCategoryClick(category.category)}
            className={classNames(
              'flex-shrink-0 p-1.5 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all',
              activeCategory === category.category
                ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10'
                : 'hover:border-gray-400 dark:hover:border-gray-500'
            )}
          >
            <img
              src={category.firstUrl}
              alt={category.category}
              className='w-8 h-8 object-contain rounded-md'
              title={category.category}
            />
          </button>
        ))}
      </div>

      {/* GIF Grid - Show only when a category is selected */}
      {activeCategory && (
        <div className='max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
          {gifData.map((category: any) => (
            <div
              key={category.category}
              className={category.category === activeCategory ? 'block' : 'hidden'}
            >
              <div className='grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 p-1'>
                {category.urls.map((url: any, index: any) => (
                  <button
                    key={index}
                    onClick={() => handleGifSelect(url)}
                    className='aspect-square p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative'
                  >
                    <img
                      src={url}
                      alt={`${category.category} GIF ${index + 1}`}
                      className='w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform'
                      loading='lazy'
                      title={`${category.category} GIF ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <textarea
        placeholder='Viết bình luận...'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='w-full min-h-[80px] sm:min-h-[100px] p-2.5 sm:p-3 rounded-lg border dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all'
      />

      {selectedGif && (
        <div className='relative inline-block group'>
          <img
            src={selectedGif}
            alt='Selected GIF'
            className='h-12 w-auto object-contain rounded-lg bg-gray-50 dark:bg-gray-700/50 p-0.5'
            title='Selected GIF'
          />
          <button
            className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800/80 text-white flex items-center justify-center hover:bg-gray-900 hover:scale-110 transition-all text-xs opacity-0 group-hover:opacity-100'
            onClick={() => setSelectedGif(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className='flex justify-between items-center gap-2'>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && !selectedGif)}
          className={classNames(
            'px-4 py-1.5 rounded-lg text-white transition-all text-sm font-medium',
            isSubmitting || (!content.trim() && !selectedGif)
              ? 'bg-gray-400 cursor-not-allowed opacity-50'
              : 'bg-primary hover:bg-primary/90 active:scale-95 shadow-sm hover:shadow'
          )}
        >
          {isSubmitting ? 'Đang đăng...' : 'Đăng'}
        </button>
      </div>
    </div>
  )
}
