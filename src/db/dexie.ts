import Dexie, { type EntityTable } from 'dexie'
import { HistoryComic } from '@/utils/history'

// Define the database interface
interface TcomicDatabase extends Dexie {
  history: EntityTable<HistoryComic, 'id'>
}

// Create and configure the database
export const db = new Dexie('TcomicHistory') as TcomicDatabase

// Define the schema
db.version(1).stores({
  history: 'id, reading_at' // Primary key 'id' (comic ID), indexed 'reading_at' (timestamp)
})

// Optional: Add hooks for debugging in development
if (import.meta.env.DEV) {
  db.history.hook('creating', (_primKey, obj) => {
    console.log('Creating history entry:', obj)
  })

  db.history.hook('updating', (modifications, primKey) => {
    console.log('Updating history entry:', primKey, modifications)
  })

  db.history.hook('deleting', (primKey) => {
    console.log('Deleting history entry:', primKey)
  })
}

export default db
