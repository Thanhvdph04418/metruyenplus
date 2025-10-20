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
    <div className='bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-light-border dark:border-dark-highlight overflow-hidden'>
      <div className='flex'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-all text-center leading-tight border-b-2
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-primary-2 text-white shadow-lg border-b-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-r border-gray-200 dark:border-gray-600 border-b-gray-200 dark:border-b-gray-600 last:border-r-0'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='p-6'>
        {/* Show loading state for current tab */}
        {isCurrentTabLoading && !currentData && (
          <div className='space-y-2'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex gap-2 py-2 animate-pulse'>
                <div className='w-[60px] h-[80px] bg-gray-200 dark:bg-gray-700 rounded'></div>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3'></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show content only for active tab - optimized rendering */}
        {!isCurrentTabLoading && currentData && (
          <div className='space-y-2'>
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

        {/* Show empty state if no data */}
        {!isCurrentTabLoading && !currentData && (
          <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
            <p>Không có dữ liệu</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopComicsSection
