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
  createImageErrorHandler
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
  const placeholderSrc = '/images/chapter-loading.svg'

  // Track image loading for cache optimization
  const handleImageLoad = () => {
    imageCache.addToCache(thumbnail)
  }
  return (
    <div className='relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded overflow-hidden'>
      <div className='w-full h-[200px] sm:h-[240px] xl:h-[220px] overflow-hidden relative bg-neutral-100 dark:bg-neutral-800 rounded-t'>
        {is_trending && (
          <span className='absolute top-2 right-2 bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded'>
            HOT
          </span>
        )}
        <Link to={`${PATH.comics}/${slug}-${id}`} title={titleFormatted} className='group block'>
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
            className={`w-full h-full object-cover xl:pointer-events-none ${
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
        <div className='hidden xl:block absolute top-[-15px] left-[-30px] z-[2] shadow-xl pointer-events-none group-hover:pointer-events-auto'>
          <div className='w-[226px] h-[330px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden scale-[0.73] group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-top-left'>
            <Link to={`${PATH.comics}/${slug}-${id}`} title={titleFormatted} className='block'>
              <div
                className='w-[226px] h-[160px] bg-cover bg-no-repeat bg-[center_30%] bg-neutral-100 dark:bg-neutral-800'
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
                className='hover:text-primary text-neutral-800 dark:text-neutral-200 font-medium text-sm block'
              >
                {titleFormatted}
              </Link>
              <span className='text-xs text-neutral-500 dark:text-neutral-400 block'>
                {updated_at}
              </span>
              <div className='flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-2 mb-2'>
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
                    className='text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded hover:text-primary transition-colors'
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              <div
                className='text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 h-[4.8em] leading-6 overflow-hidden'
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
      <div className='p-3 flex flex-col text-neutral-900 dark:text-neutral-100 space-y-1.5'>
        <Link
          to={`${PATH.comics}/${slug}-${id}`}
          title={titleFormatted}
          className='hover:text-primary font-medium text-sm leading-snug line-clamp-2 transition-colors'
        >
          {titleFormatted}
        </Link>
        <span className='text-xs text-neutral-500 dark:text-neutral-400'>{updated_at}</span>
        <p className='truncate text-sm'>
          <Link
            to={`${PATH.comics}/${slug}-${id}/${last_chapter.slug_chapter}/${last_chapter.id}`}
            title={last_chapter.name}
            className='text-primary font-medium hover:underline'
          >
            {last_chapter.name}
          </Link>
        </p>
      </div>
    </div>
  )
}
export default CardItem
