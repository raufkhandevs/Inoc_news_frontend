import api from '../axios'
import { Author } from '../types'

interface AuthorResponse {
  data: {
    authors: Author[]
  }
}

export const authorService = {
  getAll: async (): Promise<Author[]> => {
    const response = await api.get<AuthorResponse>('/authors')
    return response.data.data.authors
  }
} 