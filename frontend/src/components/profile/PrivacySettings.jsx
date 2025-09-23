// frontend/src/components/profile/PrivacySettings.jsx
import React, { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
  Switch,
  Button,
  Divider,
  Alert,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Progress,
  Chip,
} from "@heroui/react"
import { Icon } from "@iconify/react"
import { profileService } from "../../services/profileService"

const visibilityOptions = [
  {
    key: "public",
    label: "Public",
    description: "Visible to everyone",
    icon: <Icon icon="heroicons:globe-alt-20-solid" />,
    risk: "high",
  },
  {
    key: "authenticated",
    label: "Logged-in Users",
    description: "Visible to logged-in users only",
    icon: <Icon icon="heroicons:users-20-solid" />,
    risk: "medium",
  },
  {
    key: "connections",
    label: "Connections Only",
    description: "Visible to your connections only",
    icon: <Icon icon="heroicons:shield-check-20-solid" />,
    risk: "low",
  },
  {
    key: "private",
    label: "Private",
    description: "Only visible to you",
    icon: <Icon icon="heroicons:lock-closed-20-solid" />,
    risk: "none",
  },
]

const privacyFields = [
  {
    key: "email_visibility",
    label: "Email Address",
    sensitive: true,
    description: "Your email address",
  },
  {
    key: "phone_visibility",
    label: "Phone Number",
    sensitive: true,
    description: "Your phone number",
  },
  {
    key: "address_visibility",
    label: "Address Information",
    sensitive: true,
    description: "Your location and address details",
  },
  {
    key: "job_info_visibility",
    label: "Job Information",
    sensitive: false,
    description: "Your job title and company",
  },
  {
    key: "social_links_visibility",
    label: "Social Media Links",
    sensitive: false,
    description: "Your website and social media profiles",
  },
]

const PrivacySettings = ({ privacyData, onUpdate, saving }) => {
  const [settings, setSettings] = useState({
    // Field visibility settings
    email_visibility: "authenticated",
    phone_visibility: "private",
    address_visibility: "private",
    job_info_visibility: "public",
    social_links_visibility: "public",

    // Activity privacy
    show_online_status: true,
    show_last_activity: true,
    allow_search_engines: false,

    ...privacyData,
  })

  const [pendingChange, setPendingChange] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (privacyData) {
      setSettings((prev) => ({ ...prev, ...privacyData }))
    }
  }, [privacyData])

  const calculatePrivacyScore = () => {
    let score = 100

    // Deduct points for public visibility
    if (settings.email_visibility === "public") score -= 15
    if (settings.phone_visibility === "public") score -= 20
    if (settings.address_visibility === "public") score -= 25
    if (settings.allow_search_engines) score -= 10
    if (settings.show_online_status) score -= 5
    if (settings.show_last_activity) score -= 5

    return Math.max(score, 0)
  }

  const getPrivacyScoreColor = (score) => {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "danger"
  }

  const getPrivacyScoreLabel = (score) => {
    if (score >= 80) return "High Privacy"
    if (score >= 60) return "Medium Privacy"
    return "Low Privacy"
  }

  const handleFieldChange = (field, value) => {
    // Check if this change needs confirmation
    if (field === "allow_search_engines" && value === true) {
      setPendingChange({ field, value })
      onOpen()
      return
    }

    const newSettings = { ...settings, [field]: value }
    setSettings(newSettings)
    handleUpdate(newSettings)
  }

  const handleConfirmChange = () => {
    if (pendingChange) {
      const newSettings = {
        ...settings,
        [pendingChange.field]: pendingChange.value,
      }
      setSettings(newSettings)
      handleUpdate(newSettings)
      setPendingChange(null)
    }
    onClose()
  }

  const handleUpdate = async (newSettings) => {
    try {
      await onUpdate(newSettings)
    } catch (error) {
      console.error("Failed to update privacy settings:", error)
      // Revert changes on error
      setSettings(settings)
    }
  }

  const getVisibilityIcon = (value) => {
    const option = visibilityOptions.find((opt) => opt.key === value)
    return option?.icon || <Icon icon="heroicons:eye-20-solid" />
  }

  const privacyScore = calculatePrivacyScore()

  return (
    <div className="space-y-6">
      {/* Privacy Score */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="text-xl font-semibold">Privacy Score</h3>
              <p className="text-small text-default-500">
                Higher scores mean better privacy protection
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-default-900">
                {privacyScore}
              </div>
              <Chip
                color={getPrivacyScoreColor(privacyScore)}
                variant="flat"
                size="sm"
              >
                {getPrivacyScoreLabel(privacyScore)}
              </Chip>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Progress
            value={privacyScore}
            color={getPrivacyScoreColor(privacyScore)}
            className="w-full"
            size="md"
          />
        </CardBody>
      </Card>

      {/* Field-Level Privacy Controls */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Profile Field Visibility</h3>
          <p className="text-small text-default-500">
            Control who can see specific parts of your profile
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {privacyFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-medium font-medium">{field.label}</h4>
                    {field.sensitive && (
                      <Chip color="warning" size="sm" variant="flat">
                        Sensitive
                      </Chip>
                    )}
                  </div>
                  {getVisibilityIcon(settings[field.key])}
                </div>

                <p className="text-small text-default-500 mb-3">
                  {field.description}
                </p>

                <Select
                  selectedKeys={[settings[field.key]]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0]
                    handleFieldChange(field.key, value)
                  }}
                  className="max-w-xs"
                  isDisabled={saving}
                >
                  {visibilityOptions.map((option) => (
                    <SelectItem
                      key={option.key}
                      startContent={option.icon}
                      description={option.description}
                      className={option.risk === "high" ? "text-danger" : ""}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <Divider className="my-4" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Activity Privacy */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Activity Privacy</h3>
          <p className="text-small text-default-500">
            Control how your activity information is displayed
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-medium font-medium">Show Online Status</h4>
                <p className="text-small text-default-500">
                  Let others see when you're online
                </p>
              </div>
              <Switch
                isSelected={settings.show_online_status}
                onValueChange={(value) =>
                  handleFieldChange("show_online_status", value)
                }
                isDisabled={saving}
              />
            </div>

            <Divider />

            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-medium font-medium">Show Last Activity</h4>
                <p className="text-small text-default-500">
                  Display when you were last active
                </p>
              </div>
              <Switch
                isSelected={settings.show_last_activity}
                onValueChange={(value) =>
                  handleFieldChange("show_last_activity", value)
                }
                isDisabled={saving}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Search Engine Visibility */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Search Engine Visibility</h3>
        </CardHeader>
        <CardBody>
          <Alert
            color={settings.allow_search_engines ? "warning" : "success"}
            variant="flat"
            title={
              settings.allow_search_engines
                ? "Your profile may appear in search results"
                : "Your profile is hidden from search engines"
            }
            description={
              settings.allow_search_engines
                ? "Search engines like Google may index your public profile information"
                : "Your profile will not appear in search engine results"
            }
          />

          <div className="flex justify-between items-start mt-4">
            <div>
              <h4 className="text-medium font-medium">
                Allow Search Engine Indexing
              </h4>
              <p className="text-small text-default-500">
                When enabled, search engines may index your public information
              </p>
            </div>
            <Switch
              isSelected={settings.allow_search_engines}
              onValueChange={(value) =>
                handleFieldChange("allow_search_engines", value)
              }
              isDisabled={saving}
            />
          </div>
        </CardBody>
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Privacy Setting Change</ModalHeader>
          <ModalBody>
            <Alert
              color="warning"
              title="Make Profile Searchable?"
              description="You're about to make your profile visible to search engines. This means your public information may appear in Google and other search results."
            />
            <p className="text-small text-default-500 mt-4">
              Are you sure you want to proceed with this change?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="warning" onPress={handleConfirmChange}>
              Confirm Change
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default PrivacySettings
