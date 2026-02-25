import { useState, useEffect, useCallback } from 'react'
import { getComicHistory } from '@/utils/history'
import { comicsDetail } from '@/types/data'

export interface LastReadChapter {
  id: number
  name: string
  slug_chapter: string
}

export interface UseLastReadChapterReturn {
  lastReadChapter: LastReadChapter | null
  isLoadingHistory: boolean
}

/**
 * Hook for managing reading history for "Continue Reading" feature
 * Loads last read chapter from IndexedDB and resets on comic ID change
 * @param comicId - Comic ID as string or number
 * @param chapters - Array of chapters from comic detail
 * @param hasChapters - Whether comic has chapters
 * @returns Object with last read chapter info and loading state
 */
export const useLastReadChapter = (
  comicId: string | number | undefined,
  chapters: comicsDetail['chapters'] | undefined,
  hasChapters: boolean
): UseLastReadChapterReturn => {
  const [lastReadChapter, setLastReadChapter] = useState<LastReadChapter | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Reset last read chapter when comic ID changes
  useEffect(() => {
    setLastReadChapter(null)
  }, [comicId])

  // Load last read chapter from IndexedDB
  const loadLastReadChapter = useCallback(async () => {
    if (!comicId || !chapters || !hasChapters) {
      return
    }

    setIsLoadingHistory(true)
    try {
      const history = await getComicHistory(String(comicId))
      if (history) {
        const chapter = chapters.find((c) => c.id === history.chapter_id)
        if (chapter) {
          setLastReadChapter({
            id: chapter.id,
            name: chapter.name,
            slug_chapter: chapter.slug_chapter
          })
        }
      }
    } catch (error) {
      console.error('Error loading last read chapter:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [comicId, chapters, hasChapters])

  useEffect(() => {
    loadLastReadChapter()
  }, [loadLastReadChapter])

  return {
    lastReadChapter,
    isLoadingHistory
  }
}
