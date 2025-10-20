import { comics } from '@/types/data'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { HotComicCard } from '@/components'
import { useMemo, useCallback, useState, useEffect } from 'react'

interface Props {
  data?: comics[]
}

const HotComicSlider = ({ data }: Props) => {
  if (!data || data.length === 0) return null

  // Limit to 15 comics and ensure minimum slides for smooth loop
  const limitedData = useMemo(() => {
    const slides = data.slice(0, 12)
    // Ensure at least 5 slides for smooth infinite loop
    return slides.length >= 5 ? slides : [...slides, ...slides, ...slides].slice(0, 12)
  }, [data])

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Set loading to false when data is ready
  useEffect(() => {
    if (limitedData.length > 0) {
      setIsLoading(false)
    }
  }, [limitedData])

  // Embla Carousel configuration - optimized for stability
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false, // Disable free dragging for consistent behavior
      startIndex: 0,
      align: 'start',
      containScroll: 'trimSnaps', // Better scroll containment
      slidesToScroll: 1,
      skipSnaps: false,
      inViewThreshold: 0.7,
      // Prevent layout issues
      watchDrag: true,
      watchResize: true,
      watchSlides: true
    },
    [
      Autoplay({
        delay: 2500,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        jump: false,
        rootNode: (emblaRoot) => emblaRoot.parentElement
      })
    ]
  )

  // Ensure slider is properly initialized
  useEffect(() => {
    if (emblaApi && !isLoading) {
      emblaApi.reInit()
    }
  }, [emblaApi, isLoading, limitedData])

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const iconRecommend = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      width='32'
      height='32'
      className='w-7 h-7 lg:h-[32px] lg:w-[32px] text-primary'
    >
      <path d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' />
      <path d='M12 18a6 6 0 100-12 6 6 0 000 12z' />
    </svg>
  )

  return (
    <div
      className='relative w-full overflow-hidden'
      style={{
        containIntrinsicSize: '0 500px', // Adjust based on your content height
        isolation: 'isolate' // Create new stacking context
      }}
    >
      {/* Title Section */}
      <div className='flex items-center justify-between mb-6 px-2'>
        <div className='flex items-center gap-2 lg:gap-4'>
          {iconRecommend}
          <h2 className='text-xl font-bold text-gray-800 dark:text-white min-h-[28px]'>
            Truyện đề xuất
          </h2>
          <span className='bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 text-xs rounded-full font-semibold animate-pulse min-w-[80px] min-h-[20px]'>
            TRENDING
          </span>
        </div>
      </div>

       {/* Embla Carousel Section */}
       <div className='relative mx-[-8px] px-4' style={{ minHeight: '400px' }}>
         <div className='embla' ref={emblaRef}>
           <div className='embla__container'>
             {isLoading ? (
               // Loading skeleton
               Array.from({ length: 6 }).map((_, index) => (
                 <div className='embla__slide loading' key={`loading-${index}`}>
                   <div className='w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse'></div>
                 </div>
               ))
             ) : (
               limitedData.map((comic, index) => (
                 <div className='embla__slide' key={`${comic.id}-${index}`}>
                   <HotComicCard
                     data={comic}
                     index={index}
                     isAboveFold={index < 5} // Mark first 5 cards as above fold for priority loading
                   />
                 </div>
               ))
             )}
           </div>
         </div>

        {/* Custom Navigation Buttons - Desktop only */}
        <div className='hidden md:block'>
          <button
            className='embla__button embla__button--prev absolute  top-1/2 -translate-y-1/2 w-12 h-12 
                       bg-white/95 dark:bg-gray-800/95 rounded-full shadow-xl border border-gray-200 dark:border-gray-700
                       flex items-center justify-center z-20 transition-all duration-200
                       hover:bg-white dark:hover:bg-gray-800 hover:scale-105 hover:shadow-2xl'
            aria-label='Previous slide'
            onClick={scrollPrev}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='w-6 h-6 text-gray-700 dark:text-gray-200'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
            </svg>
          </button>
          <button
          style={{
            right: '15px'
          }}
            className='embla__button embla__button--next absolute -right-0 top-1/2 -translate-y-1/2 w-12 h-12 
                       bg-white/95 dark:bg-gray-800/95 rounded-full shadow-xl border border-gray-200 dark:border-gray-700
                       flex items-center justify-center z-20 transition-all duration-200
                       hover:bg-white dark:hover:bg-gray-800 hover:scale-105 hover:shadow-2xl'
            aria-label='Next slide'
            onClick={scrollNext}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='w-6 h-6 text-gray-700 dark:text-gray-200'
              aria-hidden='true'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HotComicSlider