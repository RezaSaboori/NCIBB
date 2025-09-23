import axios from "axios"
import { store } from "../store/store" // Import the store
import { logoutSuccess } from "../store/authSlice" // Import the logout action

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers["Authorization"] = "Bearer " + token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const response = await axios.post("/api/auth/token/refresh/", {
            refresh: refreshToken,
          })
          const { access } = response.data
          localStorage.setItem("access_token", access)
          axios.defaults.headers.common["Authorization"] = "Bearer " + access
          return api(originalRequest)
        } catch (refreshError) {
          // If refresh token is invalid, logout the user
          store.dispatch(logoutSuccess())
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export const getPageData = (pageName: string) => {
  return api.get(`/core/pages/${pageName}/`)
}

export default api
