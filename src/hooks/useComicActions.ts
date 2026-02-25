import { useMutation, useQueryClient } from 'react-query'
import { comicToast } from '@/utils/comicToast'
import comicApis from '@/apis/comicApis'

export interface UseComicActionsOptions {
  onFollowSuccess?: () => void
  onUnfollowSuccess?: () => void
  onLikeSuccess?: () => void
}

/**
 * Hook for comic actions (follow, unfollow, like)
 * @param comicId - Comic ID (as string or number)
 * @param options - Optional callbacks
 * @returns Object with action functions and loading states
 */
export const useComicActions = (
  comicId: string | number,
  options?: UseComicActionsOptions
) => {
  const queryClient = useQueryClient()

  const followMutation = useMutation(
    () => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      return comicApis.addFollowComic(token, Number(comicId))
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comic', comicId])
        queryClient.invalidateQueries(['comic_detail', comicId])
        queryClient.invalidateQueries(['customer', 'following'])
        comicToast.success('Đã theo dõi truyện')
        options?.onFollowSuccess?.()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể theo dõi truyện. Vui lòng thử lại.'
        comicToast.error(message)
      },
    }
  )

  const unfollowMutation = useMutation(
    () => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      return comicApis.removeFollowComic(token, Number(comicId))
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comic', comicId])
        queryClient.invalidateQueries(['comic_detail', comicId])
        queryClient.invalidateQueries(['customer', 'following'])
        comicToast.success('Đã bỏ theo dõi truyện')
        options?.onUnfollowSuccess?.()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể bỏ theo dõi. Vui lòng thử lại.'
        comicToast.error(message)
      },
    }
  )

  const likeMutation = useMutation(
    () => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      return comicApis.addLikeComic(token, Number(comicId))
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comic', comicId])
        queryClient.invalidateQueries(['comic_detail', comicId])
        comicToast.success('Đã thích truyện')
        options?.onLikeSuccess?.()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể thích truyện. Vui lòng thử lại.'
        comicToast.error(message)
      },
    }
  )

  return {
    followComic: followMutation.mutate,
    unfollowComic: unfollowMutation.mutate,
    likeComic: likeMutation.mutate,
    isFollowing: followMutation.isLoading,
    isUnfollowing: unfollowMutation.isLoading,
    isLiking: likeMutation.isLoading,
  }
}
