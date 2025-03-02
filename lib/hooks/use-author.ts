'use client'

import { useQuery } from '@tanstack/react-query'
import { authorService } from '../services/author'
import { Author } from '../types'

export function useAuthor() {
  const { data: authors, isLoading } = useQuery<Author[], Error>({
    queryKey: ['authors'],
    queryFn: authorService.getAll,
  })

  return {
    authors: authors || [],
    isLoading,
  }
} 