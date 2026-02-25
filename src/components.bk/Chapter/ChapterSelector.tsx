import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import PATH from '@/utils/path'
import { ChapterSelectorProps } from './types'

const ChapterSelector = ({
  idChapter,
  dataChapter,
  openList,
  setOpenList,
  comicIndentify
}: ChapterSelectorProps) => {
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Virtual scrolling setup for chapter list
  const rowVirtualizer = useVirtualizer({
    count: dataChapter.chapters.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 48, // Height of each chapter item (py-3 = ~48px)
    overscan: 3, // Render 3 items outside viewport
    getItemKey: (index) => dataChapter.chapters[index].id.toString()
  })

  // Auto-scroll to current chapter when dropdown opens
  const currentChapterIndex = useMemo(
    () => dataChapter.chapters.findIndex((item) => item.id === Number(idChapter)),
    [dataChapter.chapters, idChapter]
  )

  useEffect(() => {
    if (openList && currentChapterIndex !== -1) {
      setTimeout(() => {
        rowVirtualizer.scrollToIndex(currentChapterIndex, {
          align: 'center',
          behavior: 'auto'
        })
      }, 100)
    }
  }, [openList, currentChapterIndex, rowVirtualizer])

  // Memoized click handler
  const handleChapterClick = useCallback(
    (e: React.MouseEvent, item: any) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'instant' })
      setOpenList(false)
      window.location.href = `${PATH.comics}/${comicIndentify}/${item.slug_chapter}/${item.id}`
    },
    [setOpenList, comicIndentify]
  )

  return (
    <button
      className='px-2 xs:px-3 py-1 xs:py-1.5 text-gray-900 dark:text-gray-200 rounded-full relative border dark:border-gray-600 transition-all hover:border-primary dark:hover:border-primary hover:bg-gray-100 dark:hover:bg-gray-800 text-xs xs:text-sm min-w-[70px] xs:min-w-[85px] sm:min-w-[100px]'
      onClick={() => setOpenList(!openList)}
    >
      <div className='flex items-center justify-between gap-2'>
        <span className='line-clamp-1 text-[13px] sm:text-sm font-medium'>
          {dataChapter.chapters
            .find((item) => item.id === Number(idChapter))
            ?.name?.replace('Chapter ', 'Ch.')}
        </span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.8}
          stroke='currentColor'
          className={`w-4 h-4 transition-transform ${openList ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </div>
      <div
        className={`absolute z-10 top-12 border dark:border-gray-700 bg-white dark:bg-[#1a1a1a] w-[280px] py-2 rounded-2xl -translate-x-1/2 left-1/2 text-left duration-200 origin-top ${
          openList
            ? 'scale-100 pointer-events-auto opacity-100'
            : 'scale-95 pointer-events-none opacity-0'
        }`}
      >
        <h5 className='text-base font-medium px-4 pb-2 border-b dark:border-gray-700'>
          Danh sách chương ({dataChapter.chapters.length})
        </h5>
        {/* Virtual List Container */}
        <div ref={scrollElementRef} className='overflow-auto text-[15px] h-[60vh] font-normal'>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative'
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const item = dataChapter.chapters[virtualItem.index]

              return (
                <div
                  key={String(virtualItem.key)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`
                  }}
                >
                  <a
                    title={item.name}
                    href={`${PATH.comics}/${comicIndentify}/${item.slug_chapter}/${item.id}`}
                    onClick={(e) => handleChapterClick(e, item)}
                    className={`py-3 truncate px-4 duration-100 hover:bg-gray-100 dark:hover:bg-gray-800 h-full flex items-center ${
                      item.id === Number(idChapter)
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary font-medium'
                        : ''
                    }`}
                  >
                    {item.name}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </button>
  )
}

export default ChapterSelector
