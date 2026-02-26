import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import { Comment } from '@/types/data'

export const useRecentComments = (limit: number = 7) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent_comments', limit],
    queryFn: () => comicApis.getRecentComments(),
    staleTime: 3 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data.slice(0, limit) as Comment[]
  })

  return {
    comments: data || [],
    isLoading,
    error
  }
}
