import PATH from '@/utils/path'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useState, useEffect, useRef } from 'react'
import comicApis from '@/apis/comicApis'
import { dataBanner as BannerType } from '@/types/data'

const Banner = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [swiperBanners, setSwiperBanners] = useState<BannerType[]>([])
  const [gridBanners, setGridBanners] = useState<BannerType[]>([])
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Check cache first
        const cachedBanners = localStorage.getItem('banners')
        const cachedTimestamp = localStorage.getItem('bannersTimestamp')
        const CACHE_TIME = 10 * 60 * 1000

        // Use cache if it's less than 1 hour old
        if (cachedBanners && cachedTimestamp) {
          const isExpired = Date.now() - parseInt(cachedTimestamp) > CACHE_TIME
          if (!isExpired) {
            const allBanners = JSON.parse(cachedBanners)
            setGridBanners(allBanners.slice(0, 5))
            setSwiperBanners(allBanners.slice(5))
            return
          }
        }

        // Fetch new data if cache is missing or expired
        const response = await comicApis.getBanner()
        if (response.data.code === 0) {
          const allBanners = response.data.data
          // Update cache
          localStorage.setItem('banners', JSON.stringify(allBanners))
          localStorage.setItem('bannersTimestamp', Date.now().toString())

          setGridBanners(allBanners.slice(0, 5))
          setSwiperBanners(allBanners.slice(5))
        } else {
          console.log(response.data.message)
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      }
    }
    fetchBanners()
  }, [])

  useEffect(() => {
    if (el.current) {
      setIsLoading(false)
    }
  }, [el.current])

  // Modified image rendering for better performance
  const renderBackgroundImage = (imageUrl: string) => ({
    backgroundImage: `url('${imageUrl}')`,
    loading: 'lazy',
    decoding: 'async'
  })

  return (
    <section
      ref={el}
      className={`flex gap-[10px] mt-2 sm:mt-0 transition-all duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className='w-full md:w-[65%] lg:w-[510px] relative'>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          modules={[Autoplay, Pagination]}
          pagination={{ el: '.swiper-pagination', clickable: true }}
        >
          {swiperBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link
                to={`${PATH.comics}/${banner.slugComic}-${banner.comicId}`}
                title={banner.slugComic}
              >
                <div
                  className='bg-no-repeat bg-cover w-full h-[260px] md:h-[380px] bg-top md:bg-center'
                  style={renderBackgroundImage(banner.image)}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          id='swiper-banner-pagination'
          className='swiper-pagination right-0 bottom-[2px_!important]'
        />
      </div>
      <div className='flex-shrink-0 hidden md:grid grid-cols-6 gap-[10px] flex-1'>
        <div className='col-span-6 flex lg:flex-row flex-col items-center gap-[10px]'>
          {gridBanners.slice(0, 2).map((banner) => (
            <Link
              key={banner.id}
              to={`${PATH.comics}/${banner.slugComic}-${banner.comicId}`}
              title={banner.slugComic}
              className='w-full h-[185px] overflow-hidden'
            >
              <p
                className='bg-no-repeat bg-cover w-full h-full bg-center'
                style={renderBackgroundImage(banner.image)}
              />
            </Link>
          ))}
        </div>
        <div className='col-span-6 items-center gap-[10px] md:hidden lg:flex'>
          {gridBanners.slice(2, 5).map((banner) => (
            <Link
              key={banner.id}
              to={`${PATH.comics}/${banner.slugComic}-${banner.comicId}`}
              title={banner.slugComic}
              className='w-[221px] h-[185px] overflow-hidden'
            >
              <p
                className='bg-no-repeat bg-cover w-full h-full'
                style={renderBackgroundImage(banner.image)}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Banner
