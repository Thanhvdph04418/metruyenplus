import { useQuery } from 'react-query'
import { useMemo } from 'react'
import comicApis from '@/apis/comicApis'
import { PATH_MAPPING_API } from '@/utils/path'
import { comicsDetail, comics } from '@/types/data'

export interface UseComicDetailDataReturn {
  comic: comicsDetail | undefined
  weeklyComics: comics[]
  popularComics: comics[]
  isLoading: boolean
  isLoadingWeekly: boolean
  isLoadingPopular: boolean
  isError: boolean
  hasChapters: boolean
  refetch: () => void
}

/**
 * Hook for fetching comic detail page data
 * Encapsulates all data fetching for comic detail page (comic, weekly, popular)
 * @param comicId - Comic ID as string
 * @returns Object with comic data, sidebar comics, loading/error states
 */
export const useComicDetailData = (comicId: string): UseComicDetailDataReturn => {
  // PRIORITY 1: Comic Detail - Critical data first
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['comic_detail', comicId],
    queryFn: () => comicApis.getComicDetail(comicId),
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    cacheTime: 10 * 60 * 1000, // 10 minutes in cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    enabled: comicId !== '',
    retry: 2, // Reduce retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  // Load weekly data in parallel (no dependencies for better performance)
  const { data: dataWeekly, isLoading: isLoadingWeekly } = useQuery({
    queryKey: [`${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`, { page: '1', status: 'all' }],
    queryFn: () =>
      comicApis.getComicsByUrl(`${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`, {
        page: '1',
        status: 'all'
      }),
    staleTime: 10 * 60 * 1000, // Longer cache for sidebar
    cacheTime: 15 * 60 * 1000, // Keep in memory longer
    keepPreviousData: true, // Smooth transitions
    refetchOnWindowFocus: false, // Sidebar doesn't need frequent updates
    retry: 1 // Reduce retries for non-critical data
  })

  // Load popular data in parallel (no dependencies for better performance)
  const { data: dataPopular, isLoading: isLoadingPopular } = useQuery({
    queryKey: [`${PATH_MAPPING_API.popular}`, { page: '1' }],
    queryFn: () => comicApis.getComicsByUrl(`${PATH_MAPPING_API.popular}`, { page: '1' }),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    keepPreviousData: true, // No loading flashes
    refetchOnWindowFocus: false,
    retry: 1
  })

  // Memoize expensive computations for better performance
  const dataPopularComics = useMemo(
    () => dataPopular?.data.comics?.filter((comic) => comic.last_chapter),
    [dataPopular?.data.comics]
  )

  const dataWeeklyComics = useMemo(
    () => dataWeekly?.data.comics?.filter((comic) => comic.last_chapter),
    [dataWeekly?.data.comics]
  )

  const dataComics = useMemo(() => data?.data?.data, [data?.data?.data])

  // Check if comic has chapters
  const hasChapters = useMemo(
    () => Boolean(dataComics?.chapters && dataComics.chapters.length > 0),
    [dataComics?.chapters]
  )

  // Filter out empty other_names
  if (dataComics?.other_names) {
    dataComics.other_names = dataComics.other_names.filter((name) => name)
  }

  return {
    comic: dataComics,
    weeklyComics: dataWeeklyComics || [],
    popularComics: dataPopularComics || [],
    isLoading,
    isLoadingWeekly,
    isLoadingPopular,
    isError,
    hasChapters,
    refetch
  }
}
