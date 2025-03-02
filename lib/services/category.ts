import api from '../axios'
import { Category } from '../types'

interface CategoryResponse {
  data: {
    categories: Category[]
  }
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<CategoryResponse>('/categories')
    return response.data.data.categories
  }
} 