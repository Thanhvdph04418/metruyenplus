import { Header, Footer, MobileBottomTab } from '@/components'
import PATH from '@/utils/path'
import { useEffect, useState } from 'react'
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'
import { usePageTracking } from '@/hooks/useAnalytics'

type TabType = 'info' | 'following' | 'comments' | 'logout'

const CustomerLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('auth_token')

  // Get tab from URL parameter or default to 'info'
  const tabFromUrl = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(
    tabFromUrl && ['info', 'following', 'comments'].includes(tabFromUrl) ? tabFromUrl : 'info'
  )

  // Track page views for customer/profile routes
  usePageTracking()

  // Sync tab state when URL parameters change
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as TabType | null
    if (tabFromUrl && ['info', 'following', 'comments'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    } else if (!tabFromUrl) {
      setActiveTab('info')
    }
  }, [searchParams])

  // Update URL when tab changes (for programmatic tab changes)
  useEffect(() => {
    const currentTab = searchParams.get('tab')
    if (activeTab === 'info') {
      // Remove tab parameter for default tab
      if (currentTab) {
        setSearchParams({}, { replace: true })
      }
    } else if (activeTab !== 'logout' && currentTab !== activeTab) {
      // Set tab parameter for non-default tabs (except logout)
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [activeTab, searchParams, setSearchParams])

  useEffect(() => {
    // Only handle customer info route protection
    if (!token && location.pathname === PATH.customerInfo) {
      console.log('Run redirect to login')
      navigate(PATH.login, {
        state: { from: location },
        replace: true
      })
      return
    }
  }, [location.pathname]) // Remove navigate from dependencies

  const tabs = [
    {
      id: 'info',
      label: 'Thông tin tài khoản',
      title: 'Thông tin cá nhân',
      description: 'Vui lòng điền đầy đủ thông tin cá nhân',
      icon: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      )
    },
    {
      id: 'following',
      label: 'Truyện theo dõi',
      title: 'Truyện theo dõi',
      description: 'Danh sách truyện bạn đang theo dõi',
      icon: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
          />
        </svg>
      )
    },
    {
      id: 'comments',
      label: 'Bình luận',
      title: 'Bình luận của bạn',
      description: 'Tất cả bình luận của bạn trên hệ thống',
      icon: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
      )
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      title: 'Đăng xuất',
      description: 'Đăng xuất khỏi tài khoản của bạn',
      icon: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
          />
        </svg>
      )
    }
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  return (
    <div className='flex flex-col min-h-screen dark:bg-gray-900'>
      <header className='sticky top-0 z-20 left-0 right-0' id='site-header'>
        <Header />
      </header>

      <main className='flex-1 bg-gray-50 dark:bg-gray-900 pb-16 sm:pb-0'>
        <ScrollRestoration />
        <div className='max-w-screen-2xl mx-auto px-4 py-8'>
          {/* Mobile Tab Toggle */}
          <div className='lg:hidden mb-4'>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'
            >
              <div className='flex items-center gap-3'>
                {activeTabData?.icon}
                <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                  {activeTabData?.label}
                </span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
          </div>

          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar */}
            <div
              className={`
                lg:w-72 lg:shrink-0
                ${isSidebarOpen ? 'block' : 'hidden lg:block'}
              `}
            >
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:sticky lg:top-[calc(var(--header-height)+2rem)]'>
                <nav className='flex flex-col gap-2' aria-label='Tabs'>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as TabType)
                        setIsSidebarOpen(false)
                      }}
                      className={`
                        group w-full px-4 py-3 text-left rounded-lg font-medium
                        transition-all duration-200 flex items-center gap-3
                        ${
                          tab.id === 'logout'
                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : activeTab === tab.id
                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <span
                        className={`
                        ${
                          tab.id === 'logout'
                            ? ''
                            : activeTab === tab.id
                            ? 'text-primary dark:text-primary-foreground'
                            : ''
                        }
                      `}
                      >
                        {tab.icon}
                      </span>
                      <span className='text-sm'>{tab.label}</span>
                      {activeTab === tab.id && (
                        <span className='ml-auto w-1.5 h-1.5 rounded-full bg-primary'></span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6'>
              <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
                  {activeTabData?.icon}
                  {activeTabData?.title}
                </h1>
                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                  {activeTabData?.description}
                </p>
              </div>
              <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                <Outlet context={{ activeTab }} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomTab />
    </div>
  )
}

export default CustomerLayout
