import { renderSwiperSlide } from '@/components/Preview/RecentUpdateComics'
import { comics } from '@/types/data'

interface SearchResultsGridProps {
  comics: comics[]
  searchTerm: string
}

const SearchResultsGrid = ({ comics, searchTerm }: SearchResultsGridProps) => {
  return <>{renderSwiperSlide(comics, 2, '6', searchTerm)}</>
}

export default SearchResultsGrid
