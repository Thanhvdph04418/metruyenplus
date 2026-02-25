import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  mergeImageConfig,
  imageCache,
  createImageErrorHandler,
  generatePlaceholder,
  LAZY_LOAD_CONFIGS
} from '@/utils/imageOptimization'
import imgError from '/img-error.webp'

export interface ComicHeroSectionProps {
  thumbnail: string
  title: string
  isLoading?: boolean
}

/**
 * ComicHeroSection - Hero image section with blurred background
 * Pure presentational component for displaying comic hero image
 */
export const ComicHeroSection = ({ thumbnail, title, isLoading }: ComicHeroSectionProps) => {
  // Hero image optimization - check if already cached
  const isHeroCached = imageCache.isInCache(thumbnail)
  const heroImageConfig = mergeImageConfig({
    ...LAZY_LOAD_CONFIGS.hero,
    visibleByDefault: isHeroCached || true, // Hero images should load immediately
    threshold: 300 // Load earlier for hero images
  })

  // Enhanced error handling for hero image
  const handleHeroImageError = createImageErrorHandler(imgError, () => {
    console.log('Retrying hero image load')
  })

  // Track hero image loading
  const handleHeroImageLoad = () => {
    imageCache.addToCache(thumbnail)
  }

  const heroPlaceholderSrc = generatePlaceholder(240, 330)

  if (isLoading) {
    return (
      <div className='w-full min-h-[400px] relative overflow-hidden'>
        <div className='bg-gray-200 dark:bg-gray-700 h-[400px] animate-pulse' />
      </div>
    )
  }

  return (
    <figure className='w-[200px] h-[280px] sm:w-[240px] sm:h-[330px] dark:border dark:border-gray-600 -mt-20 flex-shrink-0 rounded-md overflow-hidden shadow-[0_0_5px_#444]'>
      <LazyLoadImage
        src={thumbnail}
        alt={title}
        title={title}
        width={240}
        height={330}
        effect={heroImageConfig.effect}
        placeholderSrc={heroPlaceholderSrc}
        threshold={heroImageConfig.threshold}
        delayTime={heroImageConfig.delayTime}
        delayMethod={heroImageConfig.delayMethod}
        useIntersectionObserver={heroImageConfig.useIntersectionObserver}
        visibleByDefault={heroImageConfig.visibleByDefault}
        loading='eager' // Always load hero images eagerly
        decoding='sync' // Synchronous decoding for better LCP
        wrapperClassName='block w-full h-full'
        className='h-full w-full object-cover pointer-events-none select-none priority-image'
        onLoad={handleHeroImageLoad}
        onError={handleHeroImageError}
        beforeLoad={() => {
          // Pre-load hero image for better performance
          if (!isHeroCached) {
            const img = new Image()
            img.src = thumbnail
          }
        }}
      />
    </figure>
  )
}
