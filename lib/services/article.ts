import api from '../axios'
import { Article } from '../types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface ArticlesData {
  articles: Article[]
  total: number
  page: number
  per_page: number
  last_page: number
}

export const articleService = {
  getAll: async (params?: { search?: string, page?: number }): Promise<ApiResponse<ArticlesData>> => {
    const response = await api.get<ApiResponse<ArticlesData>>('/articles', { params })
    return response.data
  },

  getMyFeeds: async (params?: { page?: number }): Promise<ApiResponse<ArticlesData>> => {
    const response = await api.get<ApiResponse<ArticlesData>>('/articles/my-feeds', { params })
    return response.data
  }
} 