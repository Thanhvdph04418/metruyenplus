import comicApis from '@/apis/comicApis'
import {
  HonettruyenSlider,
  MobileHonettruyenSlider,
  HomeComicList
  // MobileAppNotification,
  // DesktopDomainNotification
} from '@/components'
import { useQueryConfig, useHomeComicLimit } from '@/hooks'
import { comics } from '@/types/data'
import PATH from '@/utils/path'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { PATH_MAPPING_API } from '../utils/path'
import { SITE_NAME, SITE_URL } from '@/config/siteConfig'
import HistoryHome from '@/components/History/HistoryHome'
import TopComicsSection from '@/components/TopComics/TopComicsSection'
import RecentComments from '@/components/Comments/RecentComments'
import {
  HonettruyenSliderSkeleton,
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

  // Load popular comics (critical for HonettruyenSlider)
  const { data: dataHot, isLoading: isLoadingHot } = useQuery({
    queryKey: [PATH_MAPPING_API.popular, 'home', deviceType, homeComicLimit],
    queryFn: () => comicApis.genettruyensByUrl(PATH_MAPPING_API.popular, homeQueryConfig),
    staleTime: 5 * 60 * 1000, // Increased cache time for better performance
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    keepPreviousData: true // Prevent loading states on refetch
  })

  // Load recent comics in parallel (no dependencies)
  const { data: dataRecentUpdated, isLoading: isLoadingRecentUpdated } = useQuery({
    queryKey: [PATH_MAPPING_API.recent, 'home', deviceType, homeComicLimit, { isHome: 1 }],
    queryFn: () =>
      comicApis.genettruyensByUrl(PATH_MAPPING_API.recent, { ...homeQueryConfig, isHome: 1 }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const dataHonettruyens = useMemo(() => dataHot?.data.comics, [dataHot])
  const dataRecentUpdatedComics = useMemo(() => dataRecentUpdated?.data.comics, [dataRecentUpdated])

  // Load sidebar content immediately (no dependencies for better performance)
  const isMainContentLoading = false

  return (
    <>
      <Helmet>
        <title>{`Đọc Truyện Tranh Online - ${SITE_NAME}`}</title>
        <link rel='canonical' href={SITE_URL} />
        <meta
          name='description'
          content={`Web đọc truyện tranh online lớn nhất được cập nhật liên tục mỗi ngày - Cùng tham gia đọc truyện và thảo luận với hơn 10 triệu thành viên 🎉 tại ${SITE_NAME} ❤️💛💚`}
        />
      </Helmet>
      <div className='min-h-screen bg-white dark:bg-neutral-900'>
        <div className='container px-4 sm:px-6 xl:px-0 py-5 sm:py-6 max-w-[1100px]'>
          <section className='mb-8'>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 mb-3'>Nổi bật</p>
            <div className='relative w-full'>
              {isLoadingHot && !dataHot ? (
                <HonettruyenSliderSkeleton />
              ) : (
                <>
                  <div className='block md:hidden'>
                    <MobileHonettruyenSlider data={dataHonettruyens as comics[]} />
                  </div>
                  <div className='hidden md:block'>
                    <HonettruyenSlider data={dataHonettruyens as comics[]} />
                  </div>
                </>
              )}
            </div>
          </section>

          <section className='mb-10'>
            <HistoryHome />
          </section>

          <section>
            <div className='grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-10'>
              <div className='xl:col-span-8'>
                {isLoadingRecentUpdated && !dataRecentUpdated ? (
                  <HomeComicListSkeleton showIcon={true} />
                ) : (
                  <HomeComicList
                    data={dataRecentUpdatedComics}
                    title='Mới cập nhật'
                    path={PATH.recent}
                    layout='list'
                  />
                )}
              </div>
              <aside className='xl:col-span-4 space-y-6'>
                {isMainContentLoading ? (
                  <SidebarSkeleton />
                ) : (
                  <>
                    <TopComicsSection />
                    <RecentComments />
                  </>
                )}
              </aside>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Home
