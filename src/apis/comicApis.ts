import {
  ResultAPIComicChapter,
  ResultAPIComicsDetail,
  comicSuggestSearch,
  dataComics,
  dataGenres,
  CommentResponse,
  verifyCaptchaChapterComic,
  ResultLogin,
  ResultCustomerInfo,
  ResultUpdateCustomerInfo,
  UploadResponse,
  ResultListFollowComic,
  ResultRecentComments,
  ResultRecommendComicsByComicId
} from '@/types/data'
import PATH, { PATH_MAPPING_API } from '@/utils/path'
import { axiosClients } from './axiosClients'
import { generateAuthKey } from '@/utils/auth'
import pick from 'lodash/pick'
import { AxiosError } from 'axios'
import { SyncReadingHistoryRequest, SyncReadingHistoryResponse } from '@/utils/history'

export type paramOption = {
  type?: string
  status?: 'all' | 'completed' | 'updating' | string
  page?: string
  q?: string
  isHome?: number
  limit?: number
}
export type typeUrlComics =
  | typeof PATH.recent
  | typeof PATH.popular
  | typeof PATH.boy
  | typeof PATH.girl
  | typeof PATH.completed
  | typeof PATH.top
  | string

const comicApis = {
  getComicsByUrl(url: typeUrlComics, params?: paramOption) {
    const urlAPI = `/api/web/comic${url}`
    const authKey = generateAuthKey(urlAPI, params)
    return axiosClients.get<dataComics>(urlAPI, { params, headers: { 'x-request-id': authKey } })
  },
  getRecommend() {
    const url = `/api/web/comic${PATH_MAPPING_API.recommend}`
    const authKey = generateAuthKey(url, {})
    return axiosClients.get<dataComics>(url, { headers: { 'x-request-id': authKey } })
  },
  getGenre() {
    const url = `/api/web/categories`
    return axiosClients.get<dataGenres>(url)
  },
  getComicsByGenre(id: string, params?: { page?: string }) {
    const url = `/api/web/comic${PATH_MAPPING_API.genres}/${id}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, pick(params, 'page'))
    return axiosClients.get<dataComics>(url, { params, headers: { 'x-request-id': authKey } })
  },
  getNew(params?: paramOption) {
    const url = `/api/web/comic${PATH_MAPPING_API.new}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, params)
    return axiosClients.get<dataComics>(url, { params, headers: { 'x-request-id': authKey } })
  },
  getComicDetail(id: string) {
    const url = `/api/web/comic${PATH_MAPPING_API.comics}/${id}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, {})
    const tokenCustomer = localStorage.getItem('auth_token')
    return axiosClients.get<ResultAPIComicsDetail>(url, {
      headers: {
        'x-request-id': authKey,
        Authorization: tokenCustomer ? `Bearer ${tokenCustomer}` : undefined
      }
    })
  },
  getComicComments(id: string, params?: { page: number; sortBy?: 'createdAt' | 'hot' }) {
    const url = `/api/web/comic/comments/${id}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, params)
    return axiosClients.get<CommentResponse>(url, { params, headers: { 'x-request-id': authKey } })
  },
  async getComicChapter(chapterId: number, comicId: number) {
    // Get the verification token from localStorage
    // const verifyToken = localStorage.getItem('verify-token-chapter')
    // if (!verifyToken) {
    //   throw new Error('Verification token required')
    // }
    const tokenCustomer = localStorage.getItem('auth_token')
    const url = `/api/web/comic/chapters/${chapterId}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, { comicId, chapterId })
    return axiosClients.get<ResultAPIComicChapter>(url, {
      params: {
        comicId,
        chapterId
      },
      headers: {
        'x-request-id': authKey,
        // 'x-token-api': verifyToken,
        Authorization: tokenCustomer ? `Bearer ${tokenCustomer}` : undefined
      }
    })
  },
  getSearch(params?: paramOption) {
    const url = `/api/web/comic${PATH_MAPPING_API.search}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, params)
    return axiosClients.get<dataComics>(url, { params, headers: { 'x-request-id': authKey } })
  },
  getSearchSuggest(params?: { q: string }) {
    const url = `/api/web/comic${PATH_MAPPING_API.searchSuggest}`
    const uri = url.replace(/\/\d+(?=\/|$)/g, '')
    const authKey = generateAuthKey(uri, params)
    return axiosClients.get<comicSuggestSearch>(url, {
      params,
      headers: { 'x-request-id': authKey }
    })
  },

  getBanner() {
    const url = `/api/web/banner${PATH_MAPPING_API.banner}`
    return axiosClients.get<any>(url)
  },

  reportErrorChapterComic(params: {
    comicId: number
    chapterId: number
    title: string
    description?: string
  }) {
    const url = `/api/web/comic/report-chapter-comic`
    return axiosClients({
      method: 'POST',
      url,
      data: params
    })
  },

  async verifyCaptchaChapterComic(token: string) {
    const url = `/api/web/auth/verify-token-captcha`
    try {
      const response = await axiosClients.post<verifyCaptchaChapterComic>(url, { token })
      // Check if we have a valid response with token
      if (response.data?.code !== 0 || !response.data?.data?.token) {
        throw new Error('Invalid verification response: No token received')
      }

      // Save the verification token to localStorage
      localStorage.setItem('verify-token-chapter', response.data.data.token)
      return response
    } catch (error) {
      // Remove any existing invalid token
      localStorage.removeItem('verify-token-chapter')

      // Re-throw the error to be handled by the calling code
      throw error
    }
  },

  async login({
    username,
    password,
    tokenCaptcha
  }: {
    username: string
    password: string
    tokenCaptcha: string
  }) {
    try {
      const url = '/api/web/customer/login'
      const response = await axiosClients.post<ResultLogin>(url, {
        username,
        password,
        tokenCaptcha
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async signup({
    email,
    password,
    confirmPassword,
    username,
    tokenCaptcha,
    name,
    phone
  }: {
    email: string
    password: string
    confirmPassword: string
    username: string
    tokenCaptcha: string
    name?: string
    phone?: string
  }) {
    try {
      const url = '/api/web/customer/register'
      const response = await axiosClients.post<ResultLogin>(url, {
        email,
        password,
        confirmPassword,
        username,
        tokenCaptcha,
        name,
        phone
      })
      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getCustomerInfo(token: string) {
    try {
      const url = '/api/app/customer/get-customer-info'
      const response = await axiosClients.get<ResultCustomerInfo>(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.code !== 0) {
        throw new Error('Failed to get customer info')
      }
      return response.data.data.customerInfo
    } catch (error) {
      throw error
    }
  },

  async updateCustomerInfo(
    token: string,
    params: {
      name: string
      phone?: string
      avatar?: string
    }
  ) {
    try {
      const url = '/api/app/customer/update-customer-info'
      const response = await axiosClients.post<ResultUpdateCustomerInfo>(url, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async uploadAvatar(file: File, token: string) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const url = '/api/app/customer/upload-avatar'
      const response = await axiosClients.put<UploadResponse>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }
      return response.data.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        throw new Error('Vui lòng đợi 30 giây trước khi thử lại')
      }
      throw error
    }
  },

  async forgotPassword({ email, tokenCaptcha }: { email: string; tokenCaptcha: string }) {
    try {
      const url = '/api/web/customer/reset-password'
      const response = await axiosClients.post(url, { email, tokenCaptcha })
      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }
      return true
    } catch (err) {
      throw err
    }
  },

  async getListFollowComic(token: string, page: number, limit: number) {
    const url = '/api/web/customer/comic/get-list-follow'
    const response = await axiosClients.get<ResultListFollowComic>(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }
    })
    return response.data
  },

  async addFollowComic(token: string, comicId: number) {
    const url = '/api/app/customer/comic/add-follow'
    const response = await axiosClients.post(
      url,
      { comicId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  async removeFollowComic(token: string, comicId: number) {
    const url = '/api/app/customer/comic/remove-follow'
    const response = await axiosClients.post(
      url,
      { comicId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  async addLikeComic(token: string, comicId: number) {
    const url = '/api/app/customer/comic/add-like'
    const response = await axiosClients.post(
      url,
      { comicId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  async removeLikeComic(token: string, comicId: number) {
    const url = '/api/app/customer/comic/remove-like'
    const response = await axiosClients.post(
      url,
      { comicId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  async addCommentComic({
    token,
    comicId,
    chapterNumber,
    content,
    gifUrl
  }: {
    token: string
    comicId: number
    chapterNumber?: number
    content: string
    gifUrl?: string
  }): Promise<Comment> {
    const url = '/api/app/comment/add-comment'
    const response = await axiosClients.post(
      url,
      { comicId, content, chapterNumber, gif: gifUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }
    return response.data.data
  },

  async addReplyComment({
    token,
    commentId,
    content,
    gifUrl
  }: {
    token: string
    commentId: string
    content: string
    gifUrl?: string
  }): Promise<Comment> {
    const url = '/api/app/comment/add-reply'
    const response = await axiosClients.post(
      url,
      { commentId, content, gif: gifUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }
    return response.data.data
  },

  async toggleLikeComment({
    token,
    commentId,
    replyId
  }: {
    token: string
    commentId: string
    replyId?: string
  }) {
    const url = '/api/app/comment/toggle-like'
    const response = await axiosClients.post(
      url,
      { commentId, replyId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }
    return response.data.data
  },

  async syncReadingHistory(token: string, history: SyncReadingHistoryRequest[]) {
    const url = '/api/app/customer/comic/sync-reading-history'
    const response = await axiosClients.post<SyncReadingHistoryResponse>(
      url,
      { comics: history },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.code !== 0) {
      throw new Error(response.data.message)
    }
    return response.data
  },

  async removeReadingHistory(token: string, comicId: number) {
    try {
      const url = '/api/app/customer/comic/remove-history-reading'
      const response = await axiosClients.post(
        url,
        { comicId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }
      return response.data
    } catch (error) {
      console.error('Error removing reading history:', error)
    }
  },

  async removeAllReadingHistory(token: string) {
    try {
      const url = '/api/app/customer/comic/remove-all-history'
      const response = await axiosClients.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }
      return response.data
    } catch (error) {
      console.error('Error removing all reading history:', error)
    }
  },

  async getRecentComments() {
    const url = '/api/web/comic/comments/recents'
    const response = await axiosClients.get<ResultRecentComments>(url)
    return response.data
  },

  async getRecommendComicsByComicId(comicId: number) {
    const url = `/api/web/comic/recommend-by-comic?comicId=${comicId}`
    const response = await axiosClients.get<ResultRecommendComicsByComicId>(url)
    return response.data
  },

  async loginWithGoogle(token: string) {
    const url = '/api/auth/callback/google'
    const response = await axiosClients.get<ResultLogin>(url, { params: { token } })
    return response.data
  }
}
export default comicApis
