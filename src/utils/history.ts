import comicApis from '@/apis/comicApis'
import { convertToSlug } from '@/utils/slugify'
import dayjs from 'dayjs'
import { db } from '@/db/dexie'

export type HistoryComic = {
  id: string
  slug_comic: string
  title: string
  thumbnail: string
  status: string
  reading_at: number
  time: string
  last_reading: string
  chapter_id: number
  slug_chapter: string
  read_chapter_ids: number[]
}

export type SyncReadingHistoryRequest = {
  comicId: number
  lastChapterId: number
  lastReadAt: number
  readChapterIds: number[]
}

export type SyncReadingHistoryResponse = {
  code: number
  message: string
  data: {
    historyReadingComicDetailsNotInLocal: {
      comicId: number
      slug: string
      name: string
      status: string
      thumbnailUrl: string
      lastChapterId: number
      lastChapterNumber: number
      lastReadAt: number
      readChapterIds: number[]
      lastChapterInfo: {
        id: number
        updatedAt: number
        name: string
        chapterNumber: number
      }
    }[]
  }
}

// Initialize database - Dexie handles this automatically
export const initLocalDb = async (): Promise<void> => {
  try {
    await db.open()
    console.log('Dexie database opened successfully')
  } catch (error) {
    console.error('Failed to open Dexie database:', error)
    throw error
  }
}

// Add or update comic history
export const historyAddComic = async (data: HistoryComic): Promise<void> => {
  try {
    await db.history.put(data)
  } catch (error) {
    console.error('Failed to add comic to history:', error)
  }
}

// Delete specific comic from history
export const historyDeleteComic = async (key: string): Promise<void> => {
  try {
    await db.history.delete(key)

    // Also remove from backend if user is authenticated
    const token = localStorage.getItem('auth_token')
    if (token) {
      await comicApis.removeReadingHistory(token, Number(key))
    }
  } catch (error) {
    console.error('Failed to delete comic from history:', error)
  }
}

// Clear all history
export const historyDeleteComics = async (): Promise<void> => {
  try {
    await db.history.clear()

    // Also clear from backend if user is authenticated
    const token = localStorage.getItem('auth_token')
    if (token) {
      await comicApis.removeAllReadingHistory(token)
    }
  } catch (error) {
    console.error('Failed to clear history:', error)
  }
}

// Get all history sorted by reading time (most recent first)
export const getAllLocalHistory = async (): Promise<HistoryComic[]> => {
  try {
    const history = await db.history.orderBy('reading_at').reverse().toArray()

    return history
  } catch (error) {
    console.error('Failed to get local history:', error)
    return []
  }
}

// Get history for a specific comic
export const getComicHistory = async (comicId: string): Promise<HistoryComic | undefined> => {
  try {
    return await db.history.get(comicId)
  } catch (error) {
    console.error('Failed to get comic history:', error)
    return undefined
  }
}

// Get recent history (limited number of items)
export const getRecentHistory = async (limit: number = 6): Promise<HistoryComic[]> => {
  try {
    const history = await db.history.orderBy('reading_at').reverse().limit(limit).toArray()

    return history
  } catch (error) {
    console.error('Failed to get recent history:', error)
    return []
  }
}

// Sync reading history with backend
export const syncReadingHistory = async (token: string): Promise<void> => {
  try {
    const allLocalHistory = await getAllLocalHistory()
    const history: SyncReadingHistoryRequest[] = allLocalHistory.map((item) => ({
      comicId: Number(item.id),
      lastChapterId: item.chapter_id,
      lastReadAt: item.reading_at,
      readChapterIds: item.read_chapter_ids
    }))

    const response = await comicApis.syncReadingHistory(token, history)
    const historyReadingComicDetailsNotInLocal = response.data.historyReadingComicDetailsNotInLocal

    if (historyReadingComicDetailsNotInLocal.length > 0) {
      // Add server history items that are not in local storage
      const serverHistoryItems: HistoryComic[] = historyReadingComicDetailsNotInLocal.map(
        (item) => ({
          id: String(item.comicId),
          slug_comic: item.slug,
          title: item.name,
          thumbnail: item.thumbnailUrl,
          status: item.status,
          reading_at: item.lastReadAt,
          time: dayjs(item.lastReadAt).format('HH:mm - DD/MM/YYYY'),
          last_reading: item.lastChapterInfo.name,
          chapter_id: item.lastChapterId,
          slug_chapter: convertToSlug(item.lastChapterInfo.name),
          read_chapter_ids: item.readChapterIds
        })
      )

      // Bulk add server history items
      await db.history.bulkPut(serverHistoryItems)
    }
  } catch (error) {
    console.error('Error syncing reading history:', error)
    // Don't throw to prevent app crashes
  }
}

// Update read chapters for a comic
export const updateReadChapters = async (comicId: string, chapterId: number): Promise<void> => {
  try {
    const existingHistory = await db.history.get(comicId)

    if (existingHistory) {
      // Add new chapter to read list if not already present
      const readChapterIds = existingHistory.read_chapter_ids || []
      if (!readChapterIds.includes(chapterId)) {
        const updatedReadChapterIds = [...readChapterIds, chapterId].sort((a, b) => a - b)

        await db.history.update(comicId, {
          read_chapter_ids: updatedReadChapterIds
        })
      }
    }
  } catch (error) {
    console.error('Failed to update read chapters:', error)
  }
}
