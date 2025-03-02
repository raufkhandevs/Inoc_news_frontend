export interface User {
    id: number
    is_admin: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    avatar?: string
    preferences: {
        authors: Author[]
        categories: Category[]
    }
}

export interface Category {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
}

export interface Author {
    id: number
    name: string
    slug: string
}