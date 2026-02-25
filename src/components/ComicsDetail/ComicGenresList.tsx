import { Link, createSearchParams } from 'react-router-dom'
import PATH from '@/utils/path'

export interface Genre {
  id: string | number
  name: string
  slug_genre: string
}

export interface ComicGenresListProps {
  genres: Genre[]
}

/**
 * ComicGenresList - Display genre tags as clickable links
 * Pure presentational component for genre display
 */
export const ComicGenresList = ({ genres }: ComicGenresListProps) => {
  if (!genres || genres.length === 0) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-[6px] items-center my-2 mb-3 dark:text-white'>
      {genres.map((genre) => {
        if (genre.id === undefined) return null
        return (
          <Link
            to={{
              pathname: PATH.genres,
              search: createSearchParams({
                type: genre.slug_genre,
                page: '1'
              }).toString()
            }}
            title={genre.name}
            key={genre.id}
          >
            <span className='py-1 px-2 text-[13px] border border-dashed border-[#d9d9d9] hover:text-primary hover:border-primary truncate'>
              {genre.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
