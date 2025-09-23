// frontend/src/components/profile/ProfileManager.jsx
import React, { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Alert,
  Button,
} from "@heroui/react"
import { useSelector, useDispatch } from "react-redux"
import { profileService } from "../../services/profileService"
import { logoutSuccess } from "../../store/authSlice" // Import logout action
import { authService } from "../../services/authService"
import { useNavigate } from "react-router-dom"
import ProfileForm from "./ProfileForm"
import PrivacySettings from "./PrivacySettings"
import SecuritySettings from "./SecuritySettings"
import PreferencesSettings from "./PreferencesSettings"
import ActivityLog from "./ActivityLog"

const ProfileManager = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logoutSuccess())
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      // Optionally, show an error message to the user
    }
  }

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      setError("You are not logged in.")
      return
    }
    try {
      setLoading(true)
      const data = await profileService.getCurrentProfile()
      setProfileData(data)
      setError(null)
    } catch (err) {
      setError("Failed to load profile data")
      console.error("Profile load error:", err)
      if (err.response && err.response.status === 401) {
        dispatch(logoutSuccess()) // Dispatch logout if unauthorized
      }
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleProfileUpdate = async (updatedData) => {
    try {
      setSaving(true)
      const response = await profileService.updateProfile(updatedData)
      setProfileData((prev) => ({ ...prev, profile: response }))
      // You might want to refresh the user data in Redux state here
      return response
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handlePrivacyUpdate = async (privacySettings) => {
    try {
      setSaving(true)
      await profileService.updatePrivacySettings(privacySettings)
      setProfileData((prev) => ({
        ...prev,
        privacy_settings: { ...prev.privacy_settings, ...privacySettings },
      }))
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading profile..." />
      </div>
    )
  }

  if (error || !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          color="danger"
          title="Access Denied"
          description={error || "Please log in to view your profile."}
          endContent={
            !isAuthenticated && (
              <Button as="a" href="/login" size="sm" variant="flat">
                Go to Login
              </Button>
            )
          }
        />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>No profile data found.</p>
      </div>
    )
  }

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <ProfileForm
          profileData={profileData}
          onUpdate={handleProfileUpdate}
          saving={saving}
          onRefresh={loadProfile}
        />
      ),
    },
    {
      id: "privacy",
      label: "Privacy",
      content: (
        <PrivacySettings
          privacyData={profileData?.privacy_settings}
          onUpdate={handlePrivacyUpdate}
          saving={saving}
        />
      ),
    },
    {
      id: "security",
      label: "Security",
      content: (
        <SecuritySettings
          userData={{ ...user, ...profileData }} // Combine Redux user with profile data
          onUpdate={handleProfileUpdate}
          saving={saving}
        />
      ),
    },
    {
      id: "preferences",
      label: "Preferences",
      content: (
        <PreferencesSettings
          preferencesData={profileData?.preferences}
          onUpdate={handleProfileUpdate}
          saving={saving}
        />
      ),
    },
    {
      id: "activity",
      label: "Activity",
      content: <ActivityLog userId={user?.id} />,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-default-900">
            Profile Settings
          </h1>
          <p className="text-default-500 mt-2">
            Manage your account information, privacy, and preferences
          </p>
        </div>
        <Button color="danger" variant="flat" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      <Card className="w-full">
        <CardBody className="p-0">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            variant="underlined"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-6 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-4 h-12",
              tabContent: "group-data-[selected=true]:text-primary",
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.id} title={tab.label}>
                <div className="p-6">{tab.content}</div>
              </Tab>
            ))}
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}

export default ProfileManager
