import { Suggesnettruyens } from '@/components'
import { comics } from '@/types/data'

export type TopComicsTab = 'month' | 'week' | 'day'

interface TopComicsTabsProps {
  activeTab: TopComicsTab
  onTabChange: (tab: TopComicsTab) => void
  monthlyData?: comics[]
  weeklyData?: comics[]
  dailyData?: comics[]
  isLoadingMonthly: boolean
  isLoadingWeekly: boolean
  isLoadingDaily: boolean
}

const TopComicsTabs = ({
  activeTab,
  onTabChange,
  monthlyData,
  weeklyData,
  dailyData,
  isLoadingMonthly,
  isLoadingWeekly,
  isLoadingDaily
}: TopComicsTabsProps) => {
  const tabs = [
    {
      id: 'month' as TopComicsTab,
      label: 'Top tháng',
      data: monthlyData,
      isLoading: isLoadingMonthly
    },
    {
      id: 'week' as TopComicsTab,
      label: 'Top tuần',
      data: weeklyData,
      isLoading: isLoadingWeekly
    },
    {
      id: 'day' as TopComicsTab,
      label: 'Top ngày',
      data: dailyData,
      isLoading: isLoadingDaily
    }
  ]

  // Get current tab data and loading state
  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const currentData = currentTab?.data
  const isCurrentTabLoading = currentTab?.isLoading

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
      <div className='flex border-b border-gray-200 dark:border-gray-700 overflow-hidden rounded-t-lg'>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all
              ${index === 0 ? 'rounded-tl-lg' : ''}
              ${index === tabs.length - 1 ? 'rounded-tr-lg' : ''}
              ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='p-3'>
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
              <Suggesnettruyens
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

export default TopComicsTabs
