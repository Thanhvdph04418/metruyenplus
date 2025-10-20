import PATH from '@/utils/path'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  mergeImageConfig,
  imageCache,
  createImageErrorHandler,
  generatePlaceholder,
  LAZY_LOAD_CONFIGS
} from '@/utils/imageOptimization'

interface Props {
  title: string
  src: string
  index: number
  genres: [string]
  chapter: string
  idChapter?: number
  idComic: string
  isStyleSearch?: boolean
  searchTerm?: string
  slug?: string
  slugChapter?: string
  scrollPosition?: ScrollPosition // For trackWindowScroll HOC
}

const SuggestComics = ({
  index,
  src,
  title,
  genres,
  chapter,
  idChapter,
  idComic,
  isStyleSearch = false,
  searchTerm = '',
  slug,
  slugChapter,
  scrollPosition
}: Props) => {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className='bg-yellow-200 dark:bg-yellow-700'>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // Thumbnail optimization configuration
  const isCachedImage = imageCache.isInCache(src)
  const thumbnailConfig = mergeImageConfig({
    ...LAZY_LOAD_CONFIGS.thumbnail,
    visibleByDefault: isCachedImage || index < 5 // Load first 5 thumbnails eagerly
  })

  const handleImageError = createImageErrorHandler(imgError)
  const handleImageLoad = () => imageCache.addToCache(src)
  const placeholderSrc = generatePlaceholder(60, 80)

  return (
    <div className='hover:bg-[#f6f6f6] dark:hover:bg-[rgba(255,255,255,0.1)]'>
      <div className='px-2'>
        <div
          className={`flex gap-2 py-2 ${
            index !== 0 && 'border-t border-dashed border-[#D9D9D9] dark:border-gray-500'
          }`}
        >
          <Link title={title} to={`${PATH.comics}/${slug}-${idComic}`} className='flex-shrink-0'>
            <LazyLoadImage
              src={src}
              alt={title}
              title={title}
              effect={thumbnailConfig.effect}
              placeholderSrc={placeholderSrc}
              threshold={thumbnailConfig.threshold}
              delayTime={thumbnailConfig.delayTime}
              delayMethod={thumbnailConfig.delayMethod}
              useIntersectionObserver={thumbnailConfig.useIntersectionObserver}
              visibleByDefault={thumbnailConfig.visibleByDefault}
              scrollPosition={scrollPosition}
              width='100%'
              height='100%'
              wrapperClassName='block'
              className='w-[60px] h-[80px] object-cover'
              loading={index < 5 ? 'eager' : 'lazy'}
              decoding={index < 5 ? 'sync' : 'async'}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </Link>
          <div className={`text-sm flex flex-col ${!isStyleSearch && 'justify-between'}`}>
            <Link
              title={title}
              to={`${PATH.comics}/${slug}-${idComic}`}
              className='font-semibold hover:text-primary text-black dark:text-white dark:hover:text-primary line-clamp-1'
            >
              {highlightText(
                title
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
                searchTerm
              )}
            </Link>
            <Link
              to={`${PATH.comics}/${slug}-${idComic}/${slugChapter}/${idChapter}`}
              title={chapter}
              className='line-clamp-1 capitalize text-primary text-xs'
            >
              {chapter}
            </Link>
            <p className={`line-clamp-2 text-black dark:text-white text-xs`}>
              {Array.isArray(genres) && genres.join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuggestComics
