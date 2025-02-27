"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export interface User {
  id?: string
  firstName: string
  lastName: string
  email: string
  avatar?: string | null
  joinedDate: string
  token?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, "id" | "joinedDate" | "token">) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from cookies/localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = Cookies.get("auth-token")
      const storedUser = localStorage.getItem("user")

      if (token && storedUser) {
        const userData = JSON.parse(storedUser)
        setUser({ ...userData, token })
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt with email:", email, "and password:", password)
      setIsLoading(true)
      // In a real app, this would be an API call
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email,
        joinedDate: new Date().toISOString(),
        token: "mock-jwt-token",
      }

      // Store token in cookie (httpOnly in production)
      Cookies.set("auth-token", mockUser.token || "", {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))

      setUser(mockUser)
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Omit<User, "id" | "joinedDate" | "token">) => {
    try {
      setIsLoading(true)
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        joinedDate: new Date().toISOString(),
        token: "mock-jwt-token",
      }

      // Store token in cookie
      Cookies.set("auth-token", newUser.token || "", {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(newUser))

      setUser(newUser)
      router.push("/preferences")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Clear cookies and localStorage
      Cookies.remove("auth-token")
      localStorage.removeItem("user")
      localStorage.removeItem("preferences")

      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (data: Partial<User>) => {
    try {
      setIsLoading(true)
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...data } as User
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Update failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

