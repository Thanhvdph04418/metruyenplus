import PATH from '@/utils/path'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { comics } from '@/types/data'
import { formatNumber } from '@/utils/formatNumber'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  mergeImageConfig,
  shouldLoadWithPriority,
  imageCache,
  createImageErrorHandler,
} from '@/utils/imageOptimization'

interface Props {
  data: comics
  index?: number // For priority loading logic
  scrollPosition?: ScrollPosition // For trackWindowScroll HOC
  isAboveFold?: boolean // Explicitly mark above-fold images
}

const MobileHotComicCard = ({ data, index, scrollPosition, isAboveFold = false }: Props) => {
  const {
    id,
    slug,
    thumbnail,
    title,
    last_chapter,
    is_trending,
    total_views,
    followers,
    like_count
  } = data

  // Truncate title for mobile - shorter length
  const truncateTitle = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  // Enhanced priority loading logic for mobile
  const isPriorityImage = shouldLoadWithPriority(index, data.is_trending, isAboveFold)
  const isCachedImage = imageCache.isInCache(thumbnail)
  const imageConfig = mergeImageConfig({
    effect: 'black-and-white',
    visibleByDefault: isCachedImage || isPriorityImage || isAboveFold,
    threshold: isPriorityImage ? 200 : isAboveFold ? 150 : undefined // Lower thresholds for mobile
  })

  // Enhanced error handling with retry logic
  const handleImageError = createImageErrorHandler(imgError, () => {
    console.log(`Retrying image load for: ${title}`)
  })
  const placeholderSrc = "/images/chapter-loading.svg"

  // Track image loading for cache optimization
  const handleImageLoad = () => {
    imageCache.addToCache(thumbnail)
  }

  return (
    <div className='flex-shrink-0 w-[160px] px-1'>
      <div className='bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-[300px]'>
        {/* Image Container with mobile-optimized aspect ratio */}
        <div className='relative w-full h-[200px] overflow-hidden bg-gray-100 dark:bg-gray-800'>
          <Link to={`${PATH.comics}/${slug}-${id}`} title={title} className='block w-full h-full'>
            <LazyLoadImage
              src={thumbnail}
              title={title}
              alt={title}
              effect={imageConfig.effect}
              placeholderSrc={placeholderSrc}
              threshold={imageConfig.threshold}
              delayTime={imageConfig.delayTime}
              delayMethod={imageConfig.delayMethod}
              useIntersectionObserver={imageConfig.useIntersectionObserver}
              visibleByDefault={imageConfig.visibleByDefault}
              scrollPosition={scrollPosition}
              loading={isPriorityImage || isAboveFold ? 'eager' : 'lazy'}
              decoding={isPriorityImage || isAboveFold ? 'sync' : 'async'}
              width={160}
              height={200}
              wrapperClassName='w-full h-full block aspect-[4/5]'
              className={`w-full h-full object-cover ${
                isPriorityImage || isAboveFold ? 'priority-image' : ''
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              beforeLoad={() => {
                // Pre-load optimization for priority images
                if ((isPriorityImage || isAboveFold) && !isCachedImage) {
                  const img = new Image()
                  img.src = thumbnail
                }
              }}
            />
          </Link>

          {/* Stats Bar - Mobile optimized with smaller text */}
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2 py-1.5'>
            <div className='grid grid-cols-3 gap-1'>
              <div className='flex flex-col items-center'>
                <i className='fas fa-eye text-[10px] text-white mb-0.5' />
                <span className='text-[10px] font-medium text-white'>
                  {formatNumber(total_views || 0)}
                </span>
              </div>
              <div className='flex flex-col items-center'>
                <i className='fas fa-heart text-[10px] text-white mb-0.5' />
                <span className='text-[10px] font-medium text-white'>
                  {like_count?.toLocaleString() || 0}
                </span>
              </div>
              <div className='flex flex-col items-center'>
                <i className='fas fa-user text-[10px] text-white mb-0.5' />
                <span className='text-[10px] font-medium text-white'>
                  {followers?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Trending Badge - Smaller for mobile */}
          {is_trending && (
            <div className='absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-1.5 py-0.5 text-[10px] rounded-full font-semibold shadow-lg'>
              HOT
            </div>
          )}
        </div>

        {/* Content Section - Mobile optimized */}
        <div className='p-3 flex flex-col justify-between flex-1'>
          {/* Title with mobile-optimized height */}
          <div className='h-[20px] mb-2 overflow-hidden'>
            <Link
              to={`${PATH.comics}/${slug}-${id}`}
              title={title}
              className='block font-bold text-sm leading-5 text-gray-900 dark:text-gray-100 truncate'
            >
              {truncateTitle(title)}
            </Link>
          </div>

          {/* Latest Chapter with mobile-optimized height */}
          <div className='h-[16px] overflow-hidden'>
            <Link
              to={`${PATH.comics}/${slug}-${id}/${last_chapter.slug_chapter}/${last_chapter.id}`}
              className='block text-xs text-primary line-clamp-1 font-medium'
              title={last_chapter.name}
            >
              {last_chapter.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileHotComicCard
