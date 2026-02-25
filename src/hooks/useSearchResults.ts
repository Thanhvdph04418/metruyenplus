import { useEffect } from 'react'
import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import { trackSearch } from '@/utils/analytics'

interface UseSearchResultsParams {
  queryConfig: any
}

export const useSearchResults = ({ queryConfig }: UseSearchResultsParams) => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ['search-comic', queryConfig],
    queryFn: () => comicApis.getSearch(queryConfig),
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true
  })

  const dataSearch = data?.data

  // Track search on success
  useEffect(() => {
    if (queryConfig.q && dataSearch && !isFetching) {
      trackSearch({
        search_query: queryConfig.q,
        results_count: dataSearch.comics?.length || 0
      })
    }
  }, [queryConfig.q, dataSearch, isFetching])

  return {
    data: dataSearch,
    isError,
    isFetching,
    isLoading
  }
}
