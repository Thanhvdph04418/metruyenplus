interface SearchEmptyStateProps {
  searchTerm: string
}

const SearchEmptyState = ({ searchTerm }: SearchEmptyStateProps) => {
  return (
    <div className='flex items-center justify-center text-2xl h-[550px] text-black dark:text-white'>
      Không tìm thấy truyện với kết quả {searchTerm && `"${searchTerm}"`}
    </div>
  )
}

export default SearchEmptyState
