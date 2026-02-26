import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient, UseMutateFunction } from 'react-query'
import {
  HistoryComic,
  getAllLocalHistory,
  historyDeleteComic,
  historyDeleteComics,
  syncReadingHistory
} from '@/utils/history'

// Return type with all properties (for History page, all required; for HistoryHome, only some used)
export interface UseHistoryDataReturn {
  allHistory: HistoryComic[]
  historyComics: HistoryComic[]
  isLoading: boolean
  hasHistory: boolean
  isSyncing: boolean
  syncHistory: () => Promise<void>
  deleteItem: UseMutateFunction<void, unknown, string, unknown>
  deleteAll: UseMutateFunction<void, unknown, void, unknown>
}

export const useHistoryData = (limit?: number): UseHistoryDataReturn => {
  const queryClient = useQueryClient()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Query for local history
  const { data: allHistory = [], refetch: refetchLocal } = useQuery<HistoryComic[]>(
    ['history', 'local'],
    getAllLocalHistory,
    {
      staleTime: 0,
      onSuccess: () => {
        setIsInitialLoading(false)
      },
      onError: () => {
        setIsInitialLoading(false)
      }
    }
  )

  // Apply limit if provided (for HistoryHome)
  const historyComics = useMemo(() => {
    if (limit && limit > 0) {
      return allHistory.slice(0, limit)
    }
    return allHistory
  }, [allHistory, limit])

  // Sync mutation
  const syncMutation = useMutation((token: string) => syncReadingHistory(token), {
    onSuccess: () => {
      queryClient.invalidateQueries(['history', 'local'])
      refetchLocal()
    },
    onError: (error) => {
      console.error('Sync failed:', error)
    }
  })

  // Delete single item mutation
  const deleteMutation = useMutation((id: string) => historyDeleteComic(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['history', 'local'])
      refetchLocal()
    }
  })

  // Delete all items mutation
  const deleteAllMutation = useMutation(() => historyDeleteComics(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['history', 'local'])
      refetchLocal()
    }
  })

  // Handle sync with token check
  const handleSync = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    syncMutation.mutate(token)
  }, [syncMutation])

  // Always return all properties
  return {
    allHistory,
    historyComics,
    isLoading: isInitialLoading,
    hasHistory: allHistory.length > 0,
    isSyncing: syncMutation.isLoading,
    syncHistory: handleSync,
    deleteItem: deleteMutation.mutate,
    deleteAll: deleteAllMutation.mutate
  }
}
