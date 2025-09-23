// frontend/src/services/profileService.js
import api from "./api" // Your existing API service

class ProfileService {
  // Get current user profile
  async getCurrentProfile() {
    try {
      const response = await api.get("/auth/profile/me/")
      return response.data
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error
    }
  }

  // Update profile information
  async updateProfile(profileData) {
    try {
      const response = await api.patch("/auth/profile/me/", profileData)
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  // Upload profile picture
  async uploadProfilePicture(formData) {
    try {
      const response = await api.post(
        "/auth/profile/upload_picture/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      return response.data
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      throw error
    }
  }

  // Remove profile picture
  async removeProfilePicture() {
    try {
      const response = await api.delete("/auth/profile/remove_picture/")
      return response.data
    } catch (error) {
      console.error("Error removing profile picture:", error)
      throw error
    }
  }

  // Get completion status
  async getCompletionStatus() {
    try {
      const response = await api.get("/auth/profile/me/completion-status/")
      return response.data
    } catch (error) {
      console.error("Error getting completion status:", error)
      throw error
    }
  }

  // Privacy settings
  async getPrivacySettings() {
    try {
      const response = await api.get("/auth/privacy/")
      return response.data[0] || {} // Return first item or empty object
    } catch (error) {
      console.error("Error getting privacy settings:", error)
      throw error
    }
  }

  // Update privacy settings
  async updatePrivacySettings(settings) {
    try {
      const response = await api.post("/auth/privacy/bulk_update/", settings)
      return response.data
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      throw error
    }
  }
}

export const profileService = new ProfileService()
