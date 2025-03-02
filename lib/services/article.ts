import api from '../axios'

export interface Article {
  id: number
  title: string
  description: string
  content: string
  published_at: string
  url: string
  image_url: string
  created_at: string
  updated_at: string
  category: {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
    tags: string[]
  }
  author: {
    id: number
    source_id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
  }
}

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