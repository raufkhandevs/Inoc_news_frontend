'use client'

import { useQuery } from '@tanstack/react-query'
import { articleService } from '../services/article'
import { Article } from '../types'

interface ArticleData {
  articles: Article[]
  total: number
  currentPage: number
  perPage: number
  lastPage: number
}

interface ArticleParams {
  search?: string
  page?: number
  author_ids?: number[]
  category_ids?: number[]
}

export function useArticle(params?: ArticleParams) {
  const { data: exploreData, isLoading: isExploreLoading } = useQuery<ArticleData>({
    queryKey: ['articles', params],
    queryFn: async () => {
      const response = await articleService.getAll(params)
      return {
        articles: response.data.articles,
        total: response.data.total,
        currentPage: response.data.page,
        perPage: response.data.per_page,
        lastPage: response.data.last_page,
      }
    },
    enabled: !params?.search || params.search.length >= 3,
  })

  const { data: myFeedsData, isLoading: isMyFeedsLoading } = useQuery<ArticleData>({
    queryKey: ['my-feeds', params?.page],
    queryFn: async () => {
      const response = await articleService.getMyFeeds({ page: params?.page })
      return {
        articles: response.data.articles,
        total: response.data.total,
        currentPage: response.data.page,
        perPage: response.data.per_page,
        lastPage: response.data.last_page,
      }
    },
  })

  return {
    exploreArticles: exploreData?.articles || [],
    myFeedArticles: myFeedsData?.articles || [],
    explorePagination: exploreData ? {
      total: exploreData.total,
      currentPage: exploreData.currentPage,
      perPage: exploreData.perPage,
      lastPage: exploreData.lastPage,
    } : null,
    myFeedsPagination: myFeedsData ? {
      total: myFeedsData.total,
      currentPage: myFeedsData.currentPage,
      perPage: myFeedsData.perPage,
      lastPage: myFeedsData.lastPage,
    } : null,
    isExploreLoading,
    isMyFeedsLoading,
  }
} 