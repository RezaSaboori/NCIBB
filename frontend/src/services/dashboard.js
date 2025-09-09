import api from "./api"

export const dashboardService = {
  // Get user dashboard data
  getUserDashboard: async () => {
    const response = await api.get("/auth/dashboard/")
    return response.data
  },

  // Get admin dashboard stats
  getAdminStats: async () => {
    const response = await api.get("/core/admin-stats/")
    return response.data
  },

  // Get project stats
  getProjectStats: async () => {
    const response = await api.get("/projects/stats/")
    return response.data
  },

  // Get credit stats
  getCreditStats: async () => {
    const response = await api.get("/credits/stats/")
    return response.data
  },

  // Get message stats
  getMessageStats: async () => {
    const response = await api.get("/messaging/stats/")
    return response.data
  },

  // Get inbox data
  getInboxData: async () => {
    const response = await api.get("/messaging/inbox/")
    return response.data
  },
}
