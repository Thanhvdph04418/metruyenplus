import iconSearch from '/icon_search.webp'
import { Suggesnettruyens } from '.'
import { useState, useEffect, useCallback } from 'react'
import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import PATH from '@/utils/path'
import { createSearchParams, useNavigate } from 'react-router-dom'
import imgLoading from '/loading.gif'
import { useIsMobile } from '@/hooks'

// Types and Interfaces
interface HistoryItem {
  title: string
  id: string
  thumbnail?: string
  chapter?: string
  genres?: string[]
  slug?: string
  slugChapter?: string
}

interface SearchBarProps {
  /** Compact style when rendered inside Header */
  embedded?: boolean
}

const SearchBar = ({ embedded = false }: SearchBarProps) => {
  const [valueForm, setValueForm] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([])
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  // Search suggestions query
  const { data: dataSuggest, isLoading } = useQuery({
    queryKey: ['search-suggest', { q: debouncedValue }],
    queryFn: () => comicApis.getSearchSuggest({ q: debouncedValue }),
    enabled: debouncedValue !== '',
    staleTime: 3 * 60 * 1000
  })
  const dataComicSuggest = dataSuggest?.data

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(valueForm), 600)
    return () => clearTimeout(timer)
  }, [valueForm])

  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) setSearchHistory(JSON.parse(history))
  }, [])

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isOpen])

  // History management
  const saveToHistory = (comic: HistoryItem) => {
    const updatedHistory = [comic, ...searchHistory.filter((item) => item.id !== comic.id)].slice(
      0,
      10
    )
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }

  const removeFromHistory = (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // Event handlers
  const handleClick = (id: string, title?: string, comic?: any) => {
    if (title) {
      saveToHistory({
        id,
        title,
        thumbnail: comic.thumbnail,
        chapter: comic.lastest_chapter,
        genres: comic.genres,
        slug: comic.slug,
        slugChapter: comic.slugChapter
      })
    }
    navigate(`${PATH.comics}/${comic.slug}-${id}`)
    setValueForm('')
    setIsOpen(false)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (valueForm.trim()) {
      navigate({
        pathname: PATH.search,
        search: createSearchParams({
          q: valueForm.trim(),
          page: '1'
        }).toString()
      })
      setValueForm('')
      setIsOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setValueForm('')
  }, [])

  const SearchIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={embedded ? 'w-4 h-4 text-white-400' : 'w-5 h-5 text-white-400'}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      />
    </svg>
  )

  const SearchButton = () => (
    <button
      type='submit'
      title='Tìm kiếm'
      className={`flex items-center justify-center bg-primary text-white font-medium hover:opacity-90 transition-opacity shrink-0 ${
        embedded
          ? 'h-9 w-9 rounded-r-lg'
          : 'h-10 w-10 sm:h-11 sm:w-auto sm:px-5 rounded-r-xl sm:rounded-r-lg text-sm'
      }`}
    >
      <span className={embedded ? 'hidden' : 'hidden sm:inline'}>Tìm kiếm</span>
      <span className={embedded ? 'inline' : 'sm:hidden'}>
        <SearchIcon />
      </span>
    </button>
  )

  const HistoryList = () => (
    <>
      <p className='px-3 py-2 text-sm text-neutral-500'>Đã tìm</p>
      {searchHistory.map((item, i) => (
        <div
          key={i}
          className='relative group flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
        >
          <div
            onMouseDown={() => handleClick(item.id, item.title, item)}
            onClick={() => handleClick(item.id, item.title, item)}
            className='flex-1 flex items-center gap-3 min-w-0 cursor-pointer'
          >
            <Suggesnettruyens
              index={i}
              isStyleSearch={true}
              title={item.title}
              src={item.thumbnail || iconSearch}
              idComic={item.id}
              chapter={item.chapter || ''}
              genres={['']}
              searchTerm=''
              slug={item.slug}
              slugChapter={item.slugChapter}
            />
          </div>
          <button
            type='button'
            className='p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded transition-colors shrink-0'
            onMouseDown={(e) => {
              e.stopPropagation()
              removeFromHistory(i)
            }}
            onClick={(e) => {
              e.stopPropagation()
              removeFromHistory(i)
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      ))}
    </>
  )

  const SuggestionsList = () => (
    <>
      {dataComicSuggest?.map((item, i) => (
        <div
          key={item.id}
          onMouseDown={() => handleClick(item.id, item.title, item)}
          onClick={() => handleClick(item.id, item.title, item)}
          className='px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer'
        >
          <Suggesnettruyens
            index={i}
            isStyleSearch={true}
            title={item.title}
            src={item.thumbnail}
            idComic={item.id}
            chapter={item.lastest_chapter}
            genres={item.genres}
            searchTerm={valueForm}
            slug={item.slug}
            slugChapter={item.slugChapter}
          />
        </div>
      ))}
      {isLoading && (
        <div className='flex items-center justify-center py-8 gap-2 text-sm text-neutral-500'>
          <img src={imgLoading} alt='' loading='lazy' className='w-6 h-6' />
          Đang tìm...
        </div>
      )}
      {Array.isArray(dataComicSuggest) && !dataComicSuggest.length && (
        <div className='py-8 text-center text-sm text-neutral-500'>Không tìm thấy</div>
      )}
    </>
  )

  // ─── Mobile: Fullscreen Overlay ────────────────────────────────────────────
  if (isMobile && isOpen && !embedded) {
    return (
      <div className='fixed inset-0 z-[60] bg-white dark:bg-neutral-900 flex flex-col'>
        {/* Header */}
        <div className='flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0'>
          <button
            type='button'
            onClick={handleClose}
            className='p-2 -ml-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <form onSubmit={handleSearch} className='flex-1 flex'>
            <div className='flex-1 relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <SearchIcon />
              </div>
              <input
                autoFocus
                onChange={(e) => setValueForm(e.target.value)}
                value={valueForm}
                type='text'
                placeholder='Tìm truyện, tác giả...'
                className='w-full h-10 pl-10 pr-10 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 rounded-lg outline-none text-sm focus:ring-1 focus:ring-primary'
              />
              {valueForm && (
                <button
                  type='button'
                  onClick={() => setValueForm('')}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600'
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type='submit'
              className='ml-2 px-4 h-10 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shrink-0'
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Scrollable results */}
        <div className='flex-1 overflow-y-auto overscroll-contain'>
          {!valueForm && searchHistory.length > 0 && <HistoryList />}
          <SuggestionsList />
        </div>
      </div>
    )
  }

  // ─── Desktop + Default: Dropdown ───────────────────────────────────────────
  return (
    <div className={embedded ? 'w-full' : 'w-full py-3'}>
      <div className={embedded ? 'w-full' : 'flex items-center justify-center'}>
        <form
          className={`relative flex w-full rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-visible focus-within:ring-1 focus-within:ring-primary ${
            embedded ? 'shadow-none' : 'sm:w-auto max-w-[500px]'
          }`}
          onSubmit={handleSearch}
        >
          <div
            className={`flex-shrink-0 flex items-center pointer-events-none ${
              embedded ? 'pl-3' : 'pl-4'
            }`}
          >
            <SearchIcon />
          </div>
          <input
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // On mobile, don't close via blur — the overlay handles its own close
              if (!isMobile) setIsOpen(false)
            }}
            onChange={(e) => setValueForm(e.target.value)}
            value={valueForm}
            type='text'
            placeholder='Tìm truyện, tác giả...'
            className={`flex-1 min-w-0 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none ${
              embedded ? 'h-9 px-2 py-1.5 text-sm' : 'h-10 sm:h-11 px-3 py-2 text-sm'
            }`}
          />
          <SearchButton />
          {isOpen && !isMobile && (
            <div className='absolute top-full left-0 right-0 mt-1 z-50 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 max-h-[400px] overflow-y-auto py-2'>
              {!valueForm && searchHistory.length > 0 && <HistoryList />}
              <SuggestionsList />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SearchBar
