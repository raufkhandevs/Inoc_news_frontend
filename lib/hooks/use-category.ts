'use client'

import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/category'
import { Category } from '../types'

export function useCategory() {
  const { data: categories, isLoading } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })

  return {
    categories: categories || [],
    isLoading,
  }
} 