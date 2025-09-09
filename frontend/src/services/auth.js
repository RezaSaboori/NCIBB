import api from "./api"

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login/", { email, password })
    const { access, refresh, user } = response.data

    // Store tokens in localStorage
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    localStorage.setItem("user", JSON.stringify(user))

    return { user, access, refresh }
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register/", userData)
    const { access, refresh, user } = response.data

    // Store tokens in localStorage
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    localStorage.setItem("user", JSON.stringify(user))

    return { user, access, refresh }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        await api.post("/auth/logout/", { refresh: refreshToken })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("access_token")
  },

  // Get user dashboard data
  getDashboardData: async () => {
    const response = await api.get("/auth/dashboard/")
    return response.data
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.patch("/auth/profile/", profileData)
    return response.data
  },

  // Get user stats
  getUserStats: async () => {
    const response = await api.get("/auth/stats/")
    return response.data
  },
}
