import axios from "axios"
import Cookies from "js-cookie"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Refresh token logic would go here
        const token = await refreshToken()

        if (!token) {
          throw new Error("Refresh token not implemented")
        }
        
        Cookies.set("auth-token", token)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (error) {
        // Handle refresh token error or redirect to login
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

async function refreshToken() {
  // not implemented
  return ""
}

export default api

