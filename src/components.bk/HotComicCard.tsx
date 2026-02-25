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

const HotComicCard = ({ data, index, scrollPosition, isAboveFold = false }: Props) => {
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

  // Truncate title if it's too long
  const truncateTitle = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  // Enhanced priority loading logic
  const isPriorityImage = shouldLoadWithPriority(index, data.is_trending, isAboveFold)
  const isCachedImage = imageCache.isInCache(thumbnail)
  const imageConfig = mergeImageConfig({
    effect: 'black-and-white',
    visibleByDefault: isCachedImage || isPriorityImage || isAboveFold,
    threshold: isPriorityImage ? 300 : isAboveFold ? 200 : undefined
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
    <div className='flex-shrink-0 w-full sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] px-2'>
      <div className='bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-[360px] sm:h-[380px] md:h-[400px]'>
        {/* Image Container with fixed aspect ratio */}
        <div className='relative w-full h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden bg-gray-100 dark:bg-gray-800'>
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
              width={240}
              height={300}
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

          {/* Stats Bar */}
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2 sm:px-3 py-2.5'>
            <div className='grid grid-cols-3 gap-1 sm:flex sm:items-center sm:justify-between'>
              <div className='flex flex-col items-center sm:flex-row sm:gap-1.5'>
                <i className='fas fa-eye text-[13px] text-white mb-0.5 sm:mb-0' />
                <span className='text-xs font-medium text-white'>
                  {formatNumber(total_views || 0)}
                </span>
              </div>
              <div className='flex flex-col items-center sm:flex-row sm:gap-1.5'>
                <i className='fas fa-heart text-[13px] text-white mb-0.5 sm:mb-0' />
                <span className='text-xs font-medium text-white'>
                  {like_count?.toLocaleString() || 0}
                </span>
              </div>
              <div className='flex flex-col items-center sm:flex-row sm:gap-1.5'>
                <i className='fas fa-user text-[13px] text-white mb-0.5 sm:mb-0' />
                <span className='text-xs font-medium text-white'>
                  {followers?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Trending Badge */}
          {is_trending && (
            <div className='absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1 text-xs rounded-full font-semibold shadow-lg'>
              HOT
            </div>
          )}
        </div>

        {/* Content Section with fixed heights */}
        <div className='p-4 flex flex-col justify-between flex-1'>
          {/* Title with fixed height */}
          <div className='h-[24px] mb-2 overflow-hidden'>
            <Link
              to={`${PATH.comics}/${slug}-${id}`}
              title={title}
              className='block font-bold text-base leading-6 text-gray-900 dark:text-gray-100 truncate'
            >
              {truncateTitle(title)}
            </Link>
          </div>

          {/* Latest Chapter with fixed height */}
          <div className='h-[20px] overflow-hidden'>
            <Link
              to={`${PATH.comics}/${slug}-${id}/${last_chapter.slug_chapter}/${last_chapter.id}`}
              className='block text-sm text-primary line-clamp-1 font-medium'
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

export default HotComicCard