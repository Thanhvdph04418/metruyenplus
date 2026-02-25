import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import { comics } from '@/types/data'
import { highlightText, highlightHtmlContent } from '@/utils/textHighlight'

interface SearchResultsListProps {
  comics: comics[]
  searchTerm: string
}

const SearchResultsList = ({ comics, searchTerm }: SearchResultsListProps) => {
  return (
    <div className='flex flex-col gap-5'>
      {comics.map((comic) => (
        <Link
          key={comic.id}
          to={`${PATH.comics}/${comic.slug}-${comic.id}`}
          className='flex gap-4 bg-white/80 dark:bg-gray-800/80 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200'
          title={comic.title}
        >
          <div className='relative flex-shrink-0'>
            <img
              src={comic.thumbnail}
              alt={comic.title}
              title={comic.title}
              className='w-[110px] h-[146px] object-cover rounded-lg shadow-sm'
            />
            <div className='absolute inset-0 rounded-lg ring-1 ring-black/5 dark:ring-white/5' />
          </div>
          <div className='flex flex-col flex-1 min-w-0 py-1'>
            <h3 className='font-semibold text-black dark:text-white line-clamp-2 text-[15px]'>
              {highlightText(comic.title, searchTerm)}
            </h3>
            <p
              className='text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed'
              dangerouslySetInnerHTML={{
                __html: highlightHtmlContent(comic.short_description, searchTerm)
              }}
            />
            <div className='mt-auto pt-3 flex gap-2.5 text-xs font-medium'>
              <span className='px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-md'>
                {comic.last_chapter.name}
              </span>
              <span className='px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-md'>
                {comic.updated_at}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SearchResultsList
