import PATH from '@/utils/path'
import { createSearchParams, Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { comics } from '@/types/data'
import { convertToSlug } from '@/utils/slugify'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  mergeImageConfig,
  shouldLoadWithPriority,
  imageCache,
  createImageErrorHandler,
  generatePlaceholder
} from '@/utils/imageOptimization'
import { useScrollPosition } from './OptimizedImageGrid'

interface Props {
  data: comics
  index?: number // For priority loading logic
  scrollPosition?: ScrollPosition // For backward compatibility and direct usage
}

const CardItem = ({ data, index, scrollPosition: propScrollPosition }: Props) => {
  // Use scroll position from context (trackWindowScroll) or props (direct usage)
  const contextScrollPosition = useScrollPosition()
  const scrollPosition = contextScrollPosition || propScrollPosition
  const {
    id,
    slug,
    thumbnail,
    title,
    updated_at,
    short_description,
    last_chapter,
    is_trending,
    genres
  } = data
  const titleFormatted = title
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Performance optimizations
  const isPriorityImage = shouldLoadWithPriority(index, is_trending)
  const isCachedImage = imageCache.isInCache(thumbnail)
  const imageConfig = mergeImageConfig({
    effect: 'black-and-white',
    visibleByDefault: isCachedImage || isPriorityImage,
    threshold: isPriorityImage ? 200 : undefined
  })

  // Enhanced error handling with retry logic
  const handleImageError = createImageErrorHandler(imgError)
  const placeholderSrc = generatePlaceholder(240, 320)

  // Track image loading for cache optimization
  const handleImageLoad = () => {
    imageCache.addToCache(thumbnail)
  }
  return (
    <div className='relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 will-change-transform'>
      <div className='w-full h-[200px] sm:h-[240px] xl:h-[220px] overflow-hidden relative bg-gray-100 dark:bg-gray-800 rounded-t-xl sm:rounded-t-lg'>
        {is_trending && (
          <div className='absolute top-1 right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-1.5 py-[1px] text-[10px] z-[1] animate-pulse rounded-full font-semibold shadow-lg'>
            HOT
          </div>
        )}
        <Link to={`${PATH.comics}/${slug}-${id}`} title={titleFormatted} className='group'>
          <LazyLoadImage
            src={thumbnail}
            alt={titleFormatted}
            title={titleFormatted}
            effect={imageConfig.effect}
            placeholderSrc={placeholderSrc}
            threshold={imageConfig.threshold}
            delayTime={imageConfig.delayTime}
            delayMethod={imageConfig.delayMethod}
            useIntersectionObserver={imageConfig.useIntersectionObserver}
            visibleByDefault={imageConfig.visibleByDefault}
            scrollPosition={scrollPosition}
            width='100%'
            height='100%'
            wrapperClassName='w-full h-full block aspect-[3/4]'
            className={`w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500 ease-out xl:pointer-events-none transform-gpu ${
              isPriorityImage ? 'priority-image' : ''
            }`}
            loading={isPriorityImage ? 'eager' : 'lazy'}
            decoding={isPriorityImage ? 'sync' : 'async'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            beforeLoad={() => {
              // Pre-load optimization for trending/priority images
              if (isPriorityImage && !isCachedImage) {
                const img = new Image()
                img.src = thumbnail
              }
            }}
          />
        </Link>
        {/* Hover overlay with fixed positioning to prevent layout shifts */}
        <div className='hidden xl:block absolute top-[-15px] left-[-30px] z-[2] shadow-2xl pointer-events-none group-hover:pointer-events-auto'>
          <div className='w-[226px] h-[330px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden scale-[0.73] group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-top-left will-change-transform transform-gpu'>
            <Link to={`${PATH.comics}/${slug}-${id}`} title={titleFormatted} className='block'>
              <div
                className='w-[226px] h-[160px] bg-cover bg-no-repeat bg-[center_30%] bg-gray-100 dark:bg-gray-800'
                style={{
                  backgroundImage: `url('${thumbnail}'), url('${imgError}')`
                }}
                title={titleFormatted}
              />
            </Link>
            <div className='p-[14px]'>
              <Link
                to={`${PATH.comics}/${slug}-${id}`}
                title={titleFormatted}
                className='hover:text-primary dark:hover:text-primary text-[#2d3748] dark:text-[#edf2f7] font-semibold text-base leading-6 tracking-wide block'
              >
                {titleFormatted}
              </Link>
              <span className='text-sm text-gray-500 dark:text-gray-400 block font-medium'>
                {updated_at}
              </span>
              <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2 mb-2'>
                <span className='flex items-center gap-1 hover:text-primary transition-colors'>
                  <i className='fas fa-eye text-[13px]'></i>
                  <span className='font-medium'>{data.total_views?.toLocaleString() || 0}</span>
                </span>
                <span className='flex items-center gap-1 hover:text-primary transition-colors'>
                  <i className='fas fa-user text-[13px]'></i>
                  <span className='font-medium'>{data.followers?.toLocaleString() || 0}</span>
                </span>
                <span className='flex items-center gap-1 hover:text-primary transition-colors'>
                  <i className='fas fa-heart text-[13px]'></i>
                  <span className='font-medium'>{data.like_count?.toLocaleString() || 0}</span>
                </span>
              </div>
              <p className='text-sm mt-1 inline-block text-[#2d3748] dark:text-[#edf2f7] font-medium'>
                <Link
                  to={`${PATH.comics}/${slug}-${id}/${last_chapter.slug_chapter}/${last_chapter.id}`}
                  title={last_chapter.name}
                  className='text-primary hover:underline'
                >
                  {last_chapter.name}
                </Link>
              </p>
              <div className='flex flex-wrap gap-1.5 mt-2 mb-2'>
                {genres?.slice(0, 3).map((genre) => (
                  <Link
                    key={genre.id}
                    title={genre.name}
                    to={{
                      pathname: PATH.genres,
                      search: createSearchParams({
                        type: convertToSlug(genre.name),
                        page: '1'
                      }).toString()
                    }}
                    className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-[#2d3748] dark:text-gray-300 rounded-full hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              <div
                className='text-sm text-gray-600 dark:text-gray-400 line-clamp-3 h-[4.8em] leading-6 overflow-hidden'
                dangerouslySetInnerHTML={{
                  __html:
                    short_description.length > 350
                      ? short_description.slice(0, 350) + '...'
                      : short_description
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='p-2 sm:p-3 flex flex-col text-[#2d3748] dark:text-[#edf2f7] space-y-1.5 sm:space-y-2'>
        <Link
          to={`${PATH.comics}/${slug}-${id}`}
          title={titleFormatted}
          className='hover:text-primary font-semibold text-sm sm:text-base leading-4 sm:leading-5 line-clamp-2 tracking-wide transition-colors duration-200 min-h-[2rem] sm:min-h-[2.5rem]'
        >
          {titleFormatted}
        </Link>
        <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium'>{updated_at}</span>
        <p className='inline-block text-xs sm:text-sm truncate'>
          <Link
            to={`${PATH.comics}/${slug}-${id}/${last_chapter.slug_chapter}/${last_chapter.id}`}
            title={last_chapter.name}
            className='text-primary whitespace-nowrap font-medium hover:underline transition-all duration-200'
          >
            {last_chapter.name}
          </Link>
        </p>
      </div>
    </div>
  )
}
export default CardItem
