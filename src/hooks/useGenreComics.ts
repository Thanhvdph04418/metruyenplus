import { useQuery } from 'react-query'
import { useComicListLimit } from '@/hooks'
import comicApis from '@/apis/comicApis'

interface UseGenreComicsParams {
  type: string
  page: number
}

export const useGenreComics = ({ type, page }: UseGenreComicsParams) => {
  const { limit: comicListLimit, deviceType } = useComicListLimit()

  return useQuery({
    queryKey: ['comicByGenre', type, page, comicListLimit, deviceType],
    queryFn: () =>
      comicApis.getComicsByGenre(type, { page: page.toString(), limit: comicListLimit }),
    staleTime: 3 * 60 * 1000
  })
}
