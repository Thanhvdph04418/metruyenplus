import iconSearch from '/icon_search.webp'
import { SuggestComics } from '.'
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import PATH from '@/utils/path'
import { createSearchParams, useNavigate } from 'react-router-dom'
import imgLoading from '/loading.gif'
// import LunarNewYearCountdown from './LunarNewYearCountdown'

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

const SearchBar = () => {
  // State management
  const [valueForm, setValueForm] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([])
  const navigate = useNavigate()

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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // UI Components
  const SearchIcon = () => (
    <p
      className='bg-cover bg-no-repeat w-[18px] h-[18px] brightness-0 invert dark:brightness-100 dark:invert-0 sm:brightness-100 sm:invert-0'
      style={{ backgroundImage: `url(${iconSearch})` }}
    />
  )

  const SearchButton = () => (
    <button
      title='Tìm Kiếm'
      className='text-white capitalize flex items-center justify-center dark: dark:bg-gray-700 sm:bg-gradient h-[33px] sm:h-[50px] w-[50px] sm:w-[100px] lg:w-[140px] bg-red-500 is-btn-mobile-search-bar'
    >
      <span className='sm:inline-block hidden'>Tìm Kiếm</span>
      <span className='sm:hidden'>
        <SearchIcon />
      </span>
    </button>
  )

  const HistoryList = () => (
    <>
      {searchHistory.map((item, i) => (
        <div key={i} className='relative group'>
          <div
            onMouseDown={() => handleClick(item.id, item.title, item)}
            className='cursor-pointer'
          >
            <div className='flex items-center'>
              <div className='absolute left-4 top-[50%] -translate-y-[50%] text-gray-400'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='pl-12 w-full'>
                <SuggestComics
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
            </div>
          </div>
          <button
            className='absolute right-2 top-[50%] -translate-y-[50%] p-2 hover:text-red-500 transition-colors'
            onMouseDown={(e) => {
              e.stopPropagation()
              removeFromHistory(i)
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
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
          className='cursor-pointer'
        >
          <SuggestComics
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
        <div className='flex items-center justify-center h-[100px] gap-2'>
          <img src={imgLoading} alt='loading icon' loading='lazy' />
          Loading...
        </div>
      )}
      {Array.isArray(dataComicSuggest) && !dataComicSuggest.length && (
        <div className='flex items-center justify-center h-[100px]'>Not found</div>
      )}
    </>
  )

  // Main render
  return (
    <div className='w-full'>
      <div className='bg-no-repeat bg-cover py-3 sm:bg-[url("/search-bg.webp")] sm:dark:relative sm:dark:after:content-[""] sm:dark:after:absolute sm:dark:after:inset-0 sm:dark:after:bg-gray-900/80'>
        <div className='h-full'>
          <div className='h-full flex items-center justify-center'>
            {/* <div className='hidden lg:block mr-4'>
              <LunarNewYearCountdown />
            </div> */}
            <form
              className='z-20 relative flex items-center dark:text-white w-full sm:w-auto rounded-xl border border-white dark:border-dark-highlight'
              onSubmit={handleSearch}
            >
              <div className='flex-shrink-0 bg-white py-4 pl-[18px] pr-[14px] dark:bg-gray-900 hidden sm:block'>
                <SearchIcon />
              </div>
              <input
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onChange={(e) => setValueForm(e.target.value)}
                value={valueForm}
                type='text'
                placeholder='Tìm kiếm...'
                className='h-[33px] sm:h-[50px] leading-5 sm:leading-[50px] pr-4 pl-4 sm:pl-0 w-full sm:w-[320px] lg:w-[420px] outline-none dark:bg-gray-900 is-input-mobile-search-bar'
              />
              <SearchButton />
              {isOpen && (
                <div
                  className={`absolute top-[37px] md:top-[50px] left-0 z-40 border border-[#EDEDED] dark:border-gray-600 bg-white dark:bg-gray-900 w-full md:w-[470px] shadow-[0_2px_4px_0_rgba(0,0,0,0.10)] max-h-[480px] overflow-y-auto rounded-xl ${
                    !valueForm ? 'border-0' : ''
                  }`}
                >
                  {!valueForm && searchHistory.length > 0 && <HistoryList />}
                  <SuggestionsList />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
