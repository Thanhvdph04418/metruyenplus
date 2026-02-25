import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import comicApis from '@/apis/comicApis'

export interface AddCommentData {
  content: string
  chapterNumber?: number
  gifUrl?: string
  parentId?: string
}

export interface UseCommentActionsOptions {
  onAddSuccess?: () => void
  onLikeSuccess?: () => void
}

/**
 * Hook for comment actions (add comment, like comment)
 * @param comicId - Comic ID
 * @param options - Optional callbacks
 * @returns Object with action functions and loading states
 */
export const useCommentActions = (
  comicId: string | number,
  options?: UseCommentActionsOptions
) => {
  const queryClient = useQueryClient()

  const addCommentMutation = useMutation(
    (data: AddCommentData) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      
      // If parentId is provided, it's a reply
      if (data.parentId) {
        return comicApis.addReplyComment({
          token,
          commentId: data.parentId,
          content: data.content,
          gifUrl: data.gifUrl,
        })
      }
      
      // Otherwise, it's a new comment
      return comicApis.addCommentComic({
        token,
        comicId: Number(comicId),
        content: data.content,
        chapterNumber: data.chapterNumber,
        gifUrl: data.gifUrl,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', comicId])
        toast.success('Đã thêm bình luận')
        options?.onAddSuccess?.()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể thêm bình luận. Vui lòng thử lại.'
        toast.error(message)
      },
    }
  )

  const likeCommentMutation = useMutation(
    ({ commentId, replyId }: { commentId: string; replyId?: string }) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      return comicApis.toggleLikeComment({
        token,
        commentId,
        replyId,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', comicId])
        options?.onLikeSuccess?.()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể thích bình luận. Vui lòng thử lại.'
        toast.error(message)
      },
    }
  )

  return {
    addComment: addCommentMutation.mutate,
    likeComment: likeCommentMutation.mutate,
    isAddingComment: addCommentMutation.isLoading,
    isLikingComment: likeCommentMutation.isLoading,
  }
}
