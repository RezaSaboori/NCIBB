import { useState, useEffect } from "react"
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
import { authService } from "../../services/authService"
import { logoutSuccess } from "../../store/authSlice"
import { fetchUserProfile, updateUserProfile } from "../../store/profileSlice"
import { AppDispatch } from "../../store/store"
import { useNavigate } from "react-router-dom"
// @ts-expect-error no types for jsx module
import ProfileForm from "./ProfileForm.jsx"
// @ts-expect-error no types for jsx module
import SecuritySettings from "./SecuritySettings.jsx"
// @ts-expect-error no types for jsx module
import ActivityLog from "./ActivityLog.jsx"

const ProfileManager = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const { isAuthenticated } = useSelector((state: any) => state.auth)
  const { profile, loading, error } = useSelector((state: any) => state.profile)
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, isAuthenticated])

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logoutSuccess())
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      const result = await dispatch(updateUserProfile(updatedData)).unwrap()
      return result
    } catch (error) {
      console.error("Failed to update profile:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="در حال بارگذاری پروفایل..." />
      </div>
    )
  }

  if (error || !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          color="danger"
          title="دسترسی غیرمجاز"
          description={
            error?.detail || "لطفا برای مشاهده پروفایل خود وارد شوید."
          }
          endContent={
            !isAuthenticated && (
              <Button as="a" href="/login" size="sm" variant="flat">
                برو به صفحه ورود
              </Button>
            )
          }
        />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>اطلاعات پروفایلی یافت نشد.</p>
      </div>
    )
  }

  const tabs = [
    {
      id: "profile",
      label: "پروفایل",
      content: (
        <ProfileForm
          profileData={profile}
          onUpdate={handleProfileUpdate}
          saving={loading}
          onRefresh={() => dispatch(fetchUserProfile())}
        />
      ),
    },
    {
      id: "security",
      label: "امنیت",
      content: (
        <SecuritySettings
          userData={profile}
          onUpdate={handleProfileUpdate}
          saving={loading}
        />
      ),
    },
    {
      id: "preferences",
      label: "تنظیمات",
      content: <div>تنظیمات برگزیده</div>,
    },
    {
      id: "activity",
      label: "فعالیت",
      content: <ActivityLog userId={profile?.id} />,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 text-right">
      <div className="mb-8 flex justify-between items-center">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-default-900">
            تنظیمات پروفایل
          </h1>
          <p className="text-default-500 mt-2">
            اطلاعات حساب کاربری و تنظیمات خود را مدیریت کنید
          </p>
        </div>
        <Button color="danger" variant="flat" onClick={handleLogout}>
          خروج از سیستم
        </Button>
      </div>

      <Card className="w-full">
        <CardBody className="p-0">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(String(key))}
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
