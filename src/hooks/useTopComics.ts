import { useQuery } from 'react-query'
import comicApis from '@/apis/comicApis'
import { PATH_MAPPING_API } from '@/utils/path'
import { comics } from '@/types/data'

export type TopComicsTab = 'month' | 'week' | 'day'

export const useTopComics = (activeTab: TopComicsTab) => {
  const urlPathMonth = `${PATH_MAPPING_API.top}${PATH_MAPPING_API.monthly}`
  const urlPathWeek = `${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`
  const urlPathDay = `${PATH_MAPPING_API.top}${PATH_MAPPING_API.daily}`

  // Query for monthly data
  const monthlyQuery = useQuery({
    queryKey: [urlPathMonth, { page: '1', status: 'all' }],
    queryFn: () => comicApis.genettruyensByUrl(urlPathMonth, { page: '1', status: 'all' }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  // Query for weekly data (enabled only when tab is active)
  const weeklyQuery = useQuery({
    queryKey: [urlPathWeek, { page: '1', status: 'all' }],
    queryFn: () => comicApis.genettruyensByUrl(urlPathWeek, { page: '1', status: 'all' }),
    enabled: activeTab === 'week',
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  // Query for daily data (enabled only when tab is active)
  const dailyQuery = useQuery({
    queryKey: [urlPathDay, { page: '1', status: 'all' }],
    queryFn: () => comicApis.genettruyensByUrl(urlPathDay, { page: '1', status: 'all' }),
    enabled: activeTab === 'day',
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  return {
    monthlyData: monthlyQuery.data?.data.comics as comics[] | undefined,
    weeklyData: weeklyQuery.data?.data.comics as comics[] | undefined,
    dailyData: dailyQuery.data?.data.comics as comics[] | undefined,
    isLoadingMonthly: monthlyQuery.isLoading,
    isLoadingWeekly: weeklyQuery.isLoading,
    isLoadingDaily: dailyQuery.isLoading
  }
}
