import { comics } from '@/types/data'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import imgError from '/img-error.webp'
import imgLoading from '/loading.gif'
import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
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
      <div className='flex flex-row gap-3 items-stretch'>
        <Link
          to={`${PATH.comics}/${comic.slug}-${comic.id}`}
          className='relative group block overflow-hidden rounded aspect-[3/4] w-20 flex-shrink-0 sm:w-24'
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
            className='w-full h-full object-cover'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = imgError
            }}
          />
          {comic.is_trending && (
            <span className='absolute top-1 right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-1.5 py-0.5 text-[10px] rounded-full font-medium animate-pulse'>
              HOT
            </span>
          )}
        </Link>

        <div className='flex flex-col gap-1 min-w-0 flex-1 justify-center'>
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

          <div className='flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400'>
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
      <h2 className='flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5 flex-shrink-0 text-primary'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z' />
        </svg>
        Có thể bạn sẽ thích
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {recommendedComics.map((comic: comics) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
    </section>
  )
}

export default RecommendComics
