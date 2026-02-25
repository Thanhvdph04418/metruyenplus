import PATH from '@/utils/path'
import { Link } from 'react-router-dom'
import imgError from '/img-error.webp'
import { comics } from '@/types/data'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { createImageErrorHandler } from '@/utils/imageOptimization'

interface Props {
  data: comics
  index?: number
}

const ComicListRow = ({ data }: Props) => {
  const { id, slug, thumbnail, title, updated_at, last_chapter } = data
  const handleImageError = createImageErrorHandler(imgError)
  const titleFormatted = title
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <Link
      to={`${PATH.comics}/${slug}-${id}`}
      className='flex items-center gap-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 group'
    >
      <div className='relative w-20 h-[6.5rem] flex-shrink-0 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-800'>
        <LazyLoadImage
          src={thumbnail}
          alt={titleFormatted}
          effect='opacity'
          width={80}
          height={104}
          className='w-full h-full object-cover'
          onError={handleImageError}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <span className='font-medium text-neutral-900 dark:text-neutral-100 truncate block group-hover:text-primary transition-colors'>
          {titleFormatted}
        </span>
        <Link
          to={`${PATH.comics}/${slug}-${id}/${last_chapter.slug_chapter}/${last_chapter.id}`}
          onClick={(e) => e.stopPropagation()}
          className='text-sm text-primary hover:underline truncate block'
        >
          {last_chapter.name}
        </Link>
      </div>
      <span className='text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0 tabular-nums w-14 text-right'>
        {updated_at}
      </span>
    </Link>
  )
}

export default ComicListRow
