import CryptoJS from 'crypto-js'
import dayjs from 'dayjs'
import mapValues from 'lodash/mapValues'

export const AUTHEN_KEY_API_WEB = {
  '/api/web/comic/top/chapter': 'xK9m2Pq5vR8nL3wY',
  '/api/web/comic/top/comment': 'hJ7tN4cX2dB9mE6v',
  '/api/web/comic/top/daily': 'wQ5aZ8kP3fG9nM4x',
  '/api/web/comic/top/follow': 'uY2sL7jH4vC8tR5b',
  '/api/web/comic/top/monthly': 'pD6mK9nX3wQ8vE4t',
  '/api/web/comic/top/weekly': 'bF5hN2mJ7kL4wS9x',
  '/api/web/comic/chapters': 'tR8cX4vB2nM6pH9q',
  '/api/web/comic/comments': 'gW3kL8pE5nX9jM2v',
  '/api/web/comic/completed-comics': 'yH6tB4mS9cR2wQ7n',
  '/api/web/comic/genres': 'dK5vX8nL3pH7mE4w',
  '/api/web/comic/girl-comics': 'aF9jR2tY6mN4wS8x',
  '/api/web/comic/boy-comics': 'aF9jR2tY6mN4wS323',
  '/api/web/comic/info': 'zQ7hB5vC3kL9pM2n',
  '/api/web/comic/new-comics': 'mW4sX8gH2nR6tE9j',
  '/api/web/comic/recent-update-comics': 'cP5kM9wL4vB8nX2t',
  '/api/web/comic/recommend-comics': 'fT3jH7mE2sQ9rY6w',
  '/api/web/comic/report-chapter-comic': 'bN8kR4xW6pH2vL9t',
  '/api/web/comic/search': 'qM5cY9nJ3wS7tE4h',
  '/api/web/comic/suggest': 'vB2pK8mX4fL6wR9n',
  '/api/web/comic/top': 'sH7tG3nQ9cM5xW2j',
  '/api/web/comic/trending-comics': 'kD4wP8vY6mL2tR5n',
  '/api/web/comic/genres/all': 'aF9jR2tY6mN4wS323dhjksa'
} as const

const sortObjectKeys = (obj: Record<string, any>) => {
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, any>>((result, key) => {
      result[key] = obj[key]
      return result
    }, {})
}

// Encrypt function
function encrypt(text: string, secretKey: string): string {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString()
  return ciphertext
}

export const generateAuthKey = (uri: string, data: any) => {
  const secretKey = import.meta.env.VITE_COMIC_SECRET_KEY
  const clientName = import.meta.env.VITE_COMIC_CLIENT_NAME
  const authKey = AUTHEN_KEY_API_WEB[uri as keyof typeof AUTHEN_KEY_API_WEB]
  const hourCurrent = dayjs().startOf('hour').valueOf()
  const object = mapValues(data, (value) => String(value))
  const sortedBody = sortObjectKeys(object)
  const stringCombine = `${authKey}-${uri}-${clientName}-${hourCurrent}-${JSON.stringify(
    sortedBody
  )}`
  const encryptedString = encrypt(stringCombine, secretKey)
  return encryptedString
}
