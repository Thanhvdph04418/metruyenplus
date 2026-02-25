interface HistoryPaginationProps {
  hasMore: boolean
  onLoadMore: () => void
  isLoading: boolean
}

const HistoryPagination = ({ hasMore, onLoadMore, isLoading }: HistoryPaginationProps) => {
  if (!hasMore) return null

  return (
    <div className='mt-8 text-center'>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className='inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
            Đang tải...
          </>
        ) : (
          'Xem thêm'
        )}
      </button>
    </div>
  )
}

export default HistoryPagination
