'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService, LoginCredentials, RegisterData, AuthResponse } from '../services/auth'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { User } from '../types'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading } = useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    retry: false,
    enabled: !!Cookies.get('auth-token'),
  })

  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { token, user } = response.data
      // Store token in cookie
      Cookies.set('auth-token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      // Update user data in React Query cache
      queryClient.setQueryData(['user'], user)
      router.push('/')
    },
  })

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: authService.register,
    onSuccess: (response) => {
      const { token, user } = response.data
      Cookies.set('auth-token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      queryClient.setQueryData(['user'], user)
      router.push('/preferences')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      Cookies.remove('auth-token')
      queryClient.clear()
      router.push('/login')
    },
  })

  const hasPreferences = useMemo(() => {
    return user?.preferences.categories.length || user?.preferences.authors.length
  }, [user])

  const updateUserPreferencesMutation = useMutation({
    mutationFn: authService.updateUserPreferences,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser)
    },
  })

  return {
    user,
    isLoading,
    hasPreferences,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateUserPreferences: updateUserPreferencesMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isUpdatePreferencesLoading: updateUserPreferencesMutation.isPending,
  }
} 