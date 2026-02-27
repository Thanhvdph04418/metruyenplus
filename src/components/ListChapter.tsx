import { comicsChapter } from '@/types/data'
import { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import { FaSort, FaSearch } from 'react-icons/fa'
import { useVirtualizer } from '@tanstack/react-virtual'
import { genettruyenHistory } from '@/utils/history'

interface Props {
  data: comicsChapter
  slug: string
  id: string
}

const ListChapter = memo(({ data, slug, id }: Props) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [readChapters, setReadChapters] = useState<number[]>([])
  const scrollElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadReadChapters = async () => {
      try {
        const history = await genettruyenHistory(id)
        if (history?.read_chapter_ids) {
          setReadChapters(history.read_chapter_ids)
        }
      } catch (error) {
        console.error('Error loading read chapters:', error)
      }
    }

    loadReadChapters()
  }, [id])

  // Memoized filtered and sorted chapters
  const filteredChapters = useMemo(() => {
    // Filter chapters based on search term
    const filtered = [...data].filter((chapter) =>
      chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort chapters
    filtered.sort((a, b) => {
      const chapterA = Number(a.name.match(/\d+(\.\d+)?/)?.[0])
      const chapterB = Number(b.name.match(/\d+(\.\d+)?/)?.[0])
      return sortOrder === 'desc' ? chapterB - chapterA : chapterA - chapterB
    })

    return filtered
  }, [data, sortOrder, searchTerm])

  // Virtual scrolling setup
  const rowVirtualizer = useVirtualizer({
    count: filteredChapters.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 60, // Estimated height of each chapter row
    overscan: 5 // Render 5 items outside viewport for smooth scrolling
  })

  // Memoized sort handler
  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }, [])

  const convertTimestampToText = useCallback((timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const date = new Date(timestamp)

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)

    if (minutes < 60) {
      return `${minutes} phút trước`
    } else if (hours < 24) {
      return `${hours} giờ trước`
    } else if (days < 7) {
      return `${days} ngày trước`
    } else if (weeks < 4) {
      return `${weeks} tuần trước`
    } else {
      // Format as DD-MM-YYYY for dates older than a month
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }
  }, [])

  const formatViewCount = useCallback((count: number | undefined): string => {
    if (!count) return '0'

    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toLocaleString('de-DE') // Using German locale for decimal point separator
  }, [])

  return (
    <div className='border border-neutral-200 dark:border-neutral-700 rounded p-4 shadow-sm'>
      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 sm:items-center'>
        <div className='relative flex-1'>
          <input
            type='text'
            placeholder='Tìm chương...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
          />
          <FaSearch
            className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400'
            size={14}
          />
        </div>
        <button
          onClick={handleSortToggle}
          className='flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors'
        >
          <FaSort
            className={`transition-transform duration-200 ${
              sortOrder === 'desc' ? 'rotate-0' : 'rotate-180'
            }`}
          />
          <span className='text-sm'>{sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'}</span>
        </button>
      </div>

      {/* Header */}
      <div className='grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-t-lg text-sm'>
        <div className='col-span-6'>Số chương</div>
        <div className='col-span-3'>Cập nhật</div>
        <div className='col-span-3 text-right'>Lượt xem</div>
      </div>

      {/* Virtual Chapter List */}
      <div
        ref={scrollElementRef}
        className='h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600'
        style={{
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {filteredChapters.length > 0 ? (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative'
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const item = filteredChapters[virtualItem.index]

              return (
                <Link
                  key={item.id}
                  to={`${PATH.comics}/${slug}-${id}/${item.slug_chapter}/${item.id}`}
                  className={`absolute left-0 right-0 grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 sm:py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800 transition-colors ${
                    readChapters.includes(item.id) ? 'bg-neutral-50/50 dark:bg-neutral-800/20' : ''
                  }`}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`
                  }}
                  title={item.name}
                >
                  <div className='col-span-6 font-medium hover:text-primary text-[13px] sm:text-base truncate flex items-center gap-2'>
                    <span
                      className={`${
                        readChapters.includes(item.id)
                          ? 'text-neutral-500 dark:text-neutral-400'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className='col-span-3 text-neutral-500 dark:text-neutral-400 text-[13px] sm:text-sm whitespace-nowrap'>
                    {convertTimestampToText(item.created_at)}
                  </div>
                  <div className='col-span-3 text-right text-neutral-500 dark:text-neutral-400 text-[13px] sm:text-sm'>
                    {formatViewCount(item.view_count)}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className='py-8 text-center text-neutral-500 dark:text-neutral-400'>
            Không tìm thấy chương nào
          </div>
        )}
      </div>
    </div>
  )
})

export default ListChapter
