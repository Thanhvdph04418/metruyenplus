import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useQueryParams } from '@/hooks'
import comicApis from '@/apis/comicApis'
import { dataGenres } from '@/types/data'

export const useGenreData = () => {
  const { type } = useQueryParams()

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => comicApis.getGenre(),
    staleTime: 3 * 60 * 1000
  })

  const genres = genresData?.data || []
  const currentType = type ?? 'all'

  const currentGenre = useMemo(
    () => genres.find((item) => item.id === currentType) ?? genres[0],
    [genres, currentType]
  )

  const descGenre = useMemo(
    () =>
      genres.find((item) => item.id === currentType)?.description ??
      genres[0]?.description,
    [genres, currentType]
  )

  return {
    genres: genres as dataGenres,
    currentGenre,
    descGenre,
    type: currentType
  }
}
