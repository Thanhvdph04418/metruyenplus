import { useState } from 'react'
import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import { PATH_MAPPING_API } from '@/utils/path'
import { SuggestComics } from '@/components'

type Tab = 'month' | 'week' | 'day'

const TopComicsSection = () => {
  const [activeTab, setActiveTab] = useState<Tab>('month')
  const urlPathMonth = `${PATH_MAPPING_API.top}${PATH_MAPPING_API.monthly}`
  const urlPathWeek = `${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`
  const urlPathDay = `${PATH_MAPPING_API.top}${PATH_MAPPING_API.daily}`

  // Load monthly data immediately (default active tab)
  const { data: monthlyData, isLoading: isLoadingMonthly } = useQuery({
    queryKey: [urlPathMonth, { page: '1', status: 'all' }],
    queryFn: () => comicApis.getComicsByUrl(urlPathMonth, { page: '1', status: 'all' }),
    staleTime: 5 * 60 * 1000, // Increased cache time for better performance
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    keepPreviousData: true // Prevent loading states on refetch
  })

  // Load weekly data only when tab is selected
  const { data: weeklyData, isLoading: isLoadingWeekly } = useQuery({
    queryKey: [urlPathWeek, { page: '1', status: 'all' }],
    queryFn: () => comicApis.getComicsByUrl(urlPathWeek, { page: '1', status: 'all' }),
    enabled: activeTab === 'week', // Only fetch when tab is active
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  // Load daily data only when tab is selected
  const { data: dailyData, isLoading: isLoadingDaily } = useQuery({
    queryKey: [urlPathDay, { page: '1', status: 'all' }],
    queryFn: () => comicApis.getComicsByUrl(urlPathDay, { page: '1', status: 'all' }),
    enabled: activeTab === 'day', // Only fetch when tab is active
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const tabs = [
    {
      id: 'month',
      label: 'Top tháng',
      data: monthlyData?.data.comics,
      isLoading: isLoadingMonthly
    },
    { id: 'week', label: 'Top tuần', data: weeklyData?.data.comics, isLoading: isLoadingWeekly },
    { id: 'day', label: 'Top ngày', data: dailyData?.data.comics, isLoading: isLoadingDaily }
  ]

  // Get current tab data and loading state
  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const currentData = currentTab?.data
  const isCurrentTabLoading = currentTab?.isLoading

  return (
    <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden'>
      {/* Pill tabs */}
      <div className='p-3 pb-0'>
        <div className='inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 gap-1'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className='p-3 pt-4'>
        {isCurrentTabLoading && !currentData && (
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex gap-3 py-2 animate-pulse'>
                <div className='w-14 h-[72px] bg-neutral-200 dark:bg-neutral-700 rounded-lg shrink-0' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4' />
                  <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2' />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isCurrentTabLoading && currentData && (
          <div className='space-y-1'>
            {currentData.slice(0, 6).map((item, i) => (
              <SuggestComics
                key={item.id}
                index={i}
                title={item.title}
                src={item.thumbnail}
                idChapter={item.last_chapter.id}
                chapter={item.last_chapter.name}
                genres={item.genres.map((genre) => genre.name) as [string]}
                idComic={item.id}
                slug={item.slug}
                slugChapter={item.last_chapter.slug_chapter}
              />
            ))}
          </div>
        )}

        {!isCurrentTabLoading && !currentData && (
          <div className='text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm'>
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  )
}

export default TopComicsSection
