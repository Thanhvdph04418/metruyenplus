import comicApis from '@/apis/comicApis'
import iconRecentUpdate from '/icon-recentUpdate.webp'
import {
  HotComicSlider,
  MobileHotComicSlider,
  HomeComicList,
  MobileAppNotification,
  DesktopDomainNotification
} from '@/components'
import { useQueryConfig, useHomeComicLimit } from '@/hooks'
import { comics } from '@/types/data'
import PATH from '@/utils/path'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { PATH_MAPPING_API } from '../utils/path'
import HistoryHome from '@/components/History/HistoryHome'
import TopComicsSection from '@/components/TopComics/TopComicsSection'
import RecentComments from '@/components/Comments/RecentComments'
import {
  HotComicSliderSkeleton,
  HomeComicListSkeleton,
  SidebarSkeleton
} from '@/components/Skeletons'

const Home = () => {
  const queryConfig = useQueryConfig()
  const { limit: homeComicLimit, deviceType } = useHomeComicLimit()

  // Create device-aware query config with responsive limit for home page
  const homeQueryConfig = useMemo(
    () => ({
      ...queryConfig,
      limit: homeComicLimit
    }),
    [queryConfig, homeComicLimit]
  )

  // Load popular comics (critical for HotComicSlider)
  const { data: dataHot, isLoading: isLoadingHot } = useQuery({
    queryKey: [PATH_MAPPING_API.popular, 'home', deviceType, homeComicLimit],
    queryFn: () => comicApis.getComicsByUrl(PATH_MAPPING_API.popular, homeQueryConfig),
    staleTime: 5 * 60 * 1000, // Increased cache time for better performance
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    keepPreviousData: true // Prevent loading states on refetch
  })

  // Load recent comics in parallel (no dependencies)
  const { data: dataRecentUpdated, isLoading: isLoadingRecentUpdated } = useQuery({
    queryKey: [PATH_MAPPING_API.recent, 'home', deviceType, homeComicLimit, { isHome: 1 }],
    queryFn: () =>
      comicApis.getComicsByUrl(PATH_MAPPING_API.recent, { ...homeQueryConfig, isHome: 1 }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const dataHotComics = useMemo(() => dataHot?.data.comics, [dataHot])
  const dataRecentUpdatedComics = useMemo(() => dataRecentUpdated?.data.comics, [dataRecentUpdated])

  // Load sidebar content immediately (no dependencies for better performance)
  const isMainContentLoading = false

  return (
    <>
      <Helmet>
        <title>Đọc Truyện Chữ Online - MeTruyen+</title>
        <link rel='canonical' href='https://metruyenplus.com' />
        <meta
          name='description'
          content='Web đọc truyện chữ online lớn nhất được cập nhật liên tục mỗi ngày - Cùng tham gia đọc truyện và thảo luận với hơn 10 triệu thành viên 🎉 tại MeTruyen+ ❤️💛💚'
        />
      </Helmet>
      <div className='min-h-screen bg-light-bg dark:bg-dark-bg'>
        {/* Mobile App Notification - Only shows on mobile devices */}
        <MobileAppNotification />

        {/* Desktop Domain Notification - Only shows on desktop devices */}
        <DesktopDomainNotification />

        <div className='container px-3 sm:px-4 xl:px-0 py-4 sm:py-6'>
          {/* Hero Section */}
          <section className='mb-6 sm:mb-8'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
                Chào mừng đến với{' '}
                <span className='bg-gradient-to-r from-primary to-primary-2 bg-clip-text text-transparent'>
                  MeTruyen+
                </span>
              </h1>
              <p className='text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed'>
                Khám phá thế giới truyện chữ phong phú với hàng ngàn tác phẩm hay, 
                cập nhật liên tục và trải nghiệm đọc tuyệt vời
              </p>
            </div>
            
            {/* Hot Comics Slider - Responsive */}
            <div className='relative w-full'>
              {isLoadingHot && !dataHot ? (
                <HotComicSliderSkeleton />
              ) : (
                <>
                  {/* Mobile Slider */}
                  <div className='block md:hidden'>
                    <MobileHotComicSlider data={dataHotComics as comics[]} />
                  </div>
                  {/* Desktop Slider */}
                  <div className='hidden md:block'>
                    <HotComicSlider data={dataHotComics as comics[]} />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Reading History Section */}
          <section className='mb-6 sm:mb-8'>
            <HistoryHome />
          </section>

          {/* Content Grid */}
          <section className='mb-6 sm:mb-8'>
            <div className='grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6'>
              {/* Main Content */}
              <div className='xl:col-span-3'>
                {isLoadingRecentUpdated && !dataRecentUpdated ? (
                  <HomeComicListSkeleton showIcon={true} />
                ) : (
                  <HomeComicList
                    data={dataRecentUpdatedComics}
                    title='Mới cập nhật'
                    icon={iconRecentUpdate}
                    path={PATH.recent}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className='xl:col-span-1 space-y-6'>
                {isMainContentLoading ? (
                  <SidebarSkeleton />
                ) : (
                  <>
                    <TopComicsSection />
                    <RecentComments />
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Home
