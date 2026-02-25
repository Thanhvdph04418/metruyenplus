import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useComicListLimit } from '@/hooks'
import comicApis from '@/apis/comicApis'
import PATH, { API_MAPPING_PATH } from '@/utils/path'

interface UseComicsListDataParams {
  pathname: string
  queryConfig: any
}

export const useComicsListData = ({ pathname, queryConfig }: UseComicsListDataParams) => {
  const { limit: comicListLimit, deviceType } = useComicListLimit()
  const isNewPage = pathname === PATH.new

  const pathArray = pathname.split('/').filter(Boolean)
  const PATH_MAPPING = pathArray
    .map((item) => API_MAPPING_PATH[`/${item}` as keyof typeof API_MAPPING_PATH])
    .join('')

  const listQueryConfig = useMemo(
    () => ({
      ...queryConfig,
      limit: comicListLimit
    }),
    [queryConfig, comicListLimit]
  )

  // Query 1: Regular list
  const listQuery = useQuery({
    queryKey: [PATH_MAPPING, 'list', deviceType, comicListLimit, queryConfig],
    queryFn: () => comicApis.getComicsByUrl(PATH_MAPPING, listQueryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: !isNewPage
  })

  // Query 2: New comics
  const newQuery = useQuery({
    queryKey: [pathname, 'list', deviceType, comicListLimit, queryConfig],
    queryFn: () => comicApis.getNew(listQueryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: isNewPage
  })

  const dataComics = useMemo(
    () => (isNewPage ? newQuery.data?.data : listQuery.data?.data),
    [isNewPage, newQuery.data, listQuery.data]
  )

  const isLoading = isNewPage ? newQuery.isLoading : listQuery.isLoading
  const isError = isNewPage ? newQuery.isError || newQuery.data?.data?.status === 404 : listQuery.isError || listQuery.data?.data?.status === 404

  return {
    dataComics,
    isLoading,
    isError
  }
}
