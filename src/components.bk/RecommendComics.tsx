import { comics } from '@/types/data'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import imgError from '/img-error.webp'
import imgLoading from '/loading.gif'
import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
// Import Embla Carousel
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface Props {
  comicId: number
}

const RecommendComics = ({ comicId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['recommend_comics', comicId],
    queryFn: () => comicApis.getRecommendComicsByComicId(comicId),
    staleTime: 3 * 60 * 1000,
    enabled: !!comicId
  })

  const recommendedComics = data?.data || []

  // Embla Carousel configuration for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    slidesToScroll: 1
  })

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center gap-2 h-[200px] text-black dark:text-white'>
        <img src={imgLoading} alt='loading icon' loading='lazy' />
        Loading...
      </div>
    )
  }

  if (!recommendedComics.length) {
    return null
  }

  const ComicCard = ({ comic }: { comic: comics }) => {
    return (
      <div className='flex flex-col gap-2'>
        <Link
          to={`${PATH.comics}/${comic.slug}-${comic.id}`}
          className='relative group block overflow-hidden rounded-lg aspect-[3/4]'
        >
          <LazyLoadImage
            src={comic.thumbnail}
            alt={comic.title}
            title={comic.title}
            placeholderSrc={imgError}
            width='100%'
            height='100%'
            threshold={100}
            wrapperClassName='block w-full h-full'
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = imgError
            }}
          />
          {comic.is_trending && (
            <span className='absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 text-xs rounded-full font-medium animate-pulse'>
              HOT
            </span>
          )}
          <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <span className='text-white text-sm font-medium px-3 py-1.5 border-2 border-white rounded-full'>
              Đọc ngay
            </span>
          </div>
        </Link>

        <div className='flex flex-col gap-1 px-1'>
          <Link
            to={`${PATH.comics}/${comic.slug}-${comic.id}`}
            className='font-medium text-black dark:text-white hover:text-primary dark:hover:text-primary line-clamp-2 text-sm'
            title={comic.title
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          >
            {comic.title
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Link>

          <Link
            to={`${PATH.comics}/${comic.slug}-${comic.id}/${comic.last_chapter.slug_chapter}/${comic.last_chapter.id}`}
            className='text-primary text-xs hover:underline'
            title={comic.last_chapter.name}
          >
            {comic.last_chapter.name}
          </Link>

          <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
            <span className='flex items-center gap-1'>
              <i className='fas fa-eye'></i>
              {comic.total_views?.toLocaleString() || 0}
            </span>
            <span className='flex items-center gap-1'>
              <i className='fas fa-heart'></i>
              {comic.like_count?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className='mt-8 px-4 sm:px-0'>
      <h2 className='flex items-center gap-2 border-b border-slate-200 dark:border-gray-500 pb-2 mb-4 capitalize text-primary text-lg'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-6 h-6 flex-shrink-0'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z' />
        </svg>
        Có thể bạn sẽ thích
      </h2>

      {/* Mobile Slider */}
      <div className='sm:hidden'>
        <div className='relative'>
          <div className='embla-recommend' ref={emblaRef}>
            <div className='embla-recommend__container'>
              {/* Group comics into slides of 4 (2x2 grid) */}
              {Array.from({ length: Math.ceil(recommendedComics.length / 4) }, (_, slideIndex) => (
                <div className='embla-recommend__slide' key={slideIndex}>
                  <div className='embla-recommend__slide-group'>
                    {recommendedComics
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((comic: comics) => (
                        <ComicCard key={comic.id} comic={comic} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {recommendedComics.length > 4 && (
            <>
              <button
                className='embla__button embla__button--prev absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8
                           bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg
                           flex items-center justify-center z-10 transition-all duration-200
                           hover:bg-white dark:hover:bg-gray-800 hover:scale-105'
                aria-label='Previous slide'
                onClick={scrollPrev}
              >
                <svg
                  className='w-4 h-4 text-gray-600 dark:text-gray-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <button
                className='embla__button embla__button--next absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8
                           bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg
                           flex items-center justify-center z-10 transition-all duration-200
                           hover:bg-white dark:hover:bg-gray-800 hover:scale-105'
                aria-label='Next slide'
                onClick={scrollNext}
              >
                <svg
                  className='w-4 h-4 text-gray-600 dark:text-gray-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className='hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {recommendedComics.map((comic: comics) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
    </section>
  )
}

export default RecommendComics
