import api from "./api"

const login = async (credentials) => {
  const response = await api.post("/auth/login/", credentials)
  return response.data
}

const register = async (userData) => {
  const response = await api.post("/auth/register/", userData)
  return response.data
}

const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token")
  if (refreshToken) {
    try {
      await api.post("/auth/logout/", { refresh: refreshToken })
    } catch (error) {
      console.error("Failed to logout on server", error)
    }
  }
  // Even if server logout fails, clear local tokens
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token")
  if (!refreshToken) {
    throw new Error("No refresh token found")
  }
  const response = await api.post("/auth/token/refresh/", {
    refresh: refreshToken,
  })
  localStorage.setItem("access_token", response.data.access)
  return response.data
}

const forgotPassword = async (email) => {
  const response = await api.post("/auth/password/reset/", { email })
  return response.data
}

const resetPassword = async (resetData) => {
  const response = await api.post("/auth/password/reset/confirm/", resetData)
  return response.data
}

export const authService = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
}
