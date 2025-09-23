// frontend/src/components/profile/ProfileForm.jsx
import React, { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button,
  Avatar,
  Select,
  SelectItem,
  Divider,
  Progress,
  Chip,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react"
import { Icon } from "@iconify/react"
import { profileService } from "../../services/profileService"
import ImageCropModal from "./ImageCropModal"
import CompletionCard from "./CompletionCard"

const profileSchema = yup.object({
  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  display_name: yup
    .string()
    .max(100, "Display name must be less than 100 characters"),
  bio: yup.string().max(2000, "Bio must be less than 2000 characters"),
  job_title: yup
    .string()
    .max(200, "Job title must be less than 200 characters"),
  company: yup
    .string()
    .max(200, "Company name must be less than 200 characters"),
  website: yup.string().url("Please enter a valid URL"),
  linkedin_url: yup
    .string()
    .url("Please enter a valid LinkedIn URL")
    .matches(/linkedin\\.com/, "Must be a LinkedIn URL"),
  github_url: yup
    .string()
    .url("Please enter a valid GitHub URL")
    .matches(/github\\.com/, "Must be a GitHub URL"),
})

const genderOptions = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "other", label: "Other" },
  { key: "prefer_not_to_say", label: "Prefer not to say" },
]

const ProfileForm = ({ profileData, onUpdate, saving, onRefresh }) => {
  const [editMode, setEditMode] = useState(false)
  const [completionData, setCompletionData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  const {
    isOpen: isCropOpen,
    onOpen: onCropOpen,
    onClose: onCropClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: profileData?.profile?.first_name || "",
      last_name: profileData?.profile?.last_name || "",
      display_name: profileData?.profile?.display_name || "",
      bio: profileData?.profile?.bio || "",
      job_title: profileData?.profile?.job_title || "",
      company: profileData?.profile?.company || "",
      department: profileData?.profile?.department || "",
      website: profileData?.profile?.website || "",
      linkedin_url: profileData?.profile?.linkedin_url || "",
      github_url: profileData?.profile?.github_url || "",
      city: profileData?.profile?.city || "",
      state_province: profileData?.profile?.state_province || "",
      country: profileData?.profile?.country || "",
      gender: profileData?.profile?.gender || "",
    },
    mode: "onChange",
  })

  React.useEffect(() => {
    loadCompletionData()
  }, [profileData])

  React.useEffect(() => {
    // Reset form when profileData changes
    if (profileData?.profile) {
      reset({
        first_name: profileData.profile.first_name || "",
        last_name: profileData.profile.last_name || "",
        display_name: profileData.profile.display_name || "",
        bio: profileData.profile.bio || "",
        job_title: profileData.profile.job_title || "",
        company: profileData.profile.company || "",
        department: profileData.profile.department || "",
        website: profileData.profile.website || "",
        linkedin_url: profileData.profile.linkedin_url || "",
        github_url: profileData.profile.github_url || "",
        city: profileData.profile.city || "",
        state_province: profileData.profile.state_province || "",
        country: profileData.profile.country || "",
        gender: profileData.profile.gender || "",
      })
    }
  }, [profileData, reset])

  const loadCompletionData = async () => {
    try {
      const data = await profileService.getCompletionStatus()
      setCompletionData(data)
    } catch (error) {
      console.error("Failed to load completion data:", error)
    }
  }

  const onSubmit = async (formData) => {
    try {
      await onUpdate(formData)
      setEditMode(false)
      await loadCompletionData()
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setImageFile(file)
      onCropOpen()
    }
  }

  const handleImageUpload = async (croppedImageBlob) => {
    try {
      const formData = new FormData()
      formData.append("profile_picture", croppedImageBlob, "profile.jpg")

      await profileService.uploadProfilePicture(formData)
      onCropClose()
      setImageFile(null)
      await onRefresh()
    } catch (error) {
      console.error("Failed to upload image:", error)
    }
  }

  const handleImageDelete = async () => {
    try {
      await profileService.removeProfilePicture()
      onDeleteClose()
      await onRefresh()
    } catch (error) {
      console.error("Failed to delete image:", error)
    }
  }

  const profile = profileData?.profile

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      {completionData && (
        <CompletionCard data={completionData} onRefresh={loadCompletionData} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <CardBody className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar
                  src={profile?.profile_picture_url || "/default-profile.png"}
                  name={profile?.initials || "U"}
                  className="w-32 h-32 text-2xl"
                  isBordered
                  color="primary"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  isIconOnly
                  size="sm"
                  variant="solid"
                  color="primary"
                  className="absolute -bottom-2 -right-2"
                  onPress={() => fileInputRef.current?.click()}
                >
                  <Icon icon="heroicons:photo" className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center">
                <User
                  name={profile?.full_name || "Unknown User"}
                  description={
                    profile?.job_title
                      ? `${profile.job_title}${profile.company ? ` at ${profile.company}` : ""}`
                      : "No job title set"
                  }
                  classNames={{
                    base: "justify-center",
                    wrapper: "flex flex-col items-center",
                    name: "text-lg font-semibold",
                    description: "text-small text-default-500",
                  }}
                />
              </div>

              {profile?.profile_picture_url && (
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  startContent={
                    <Icon icon="heroicons:trash" className="w-4 h-4" />
                  }
                  onPress={onDeleteOpen}
                >
                  Remove Photo
                </Button>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Profile Information</h3>
                <p className="text-small text-default-500">
                  Update your personal information and preferences
                </p>
              </div>

              {!editMode ? (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={
                    <Icon icon="heroicons:pencil" className="w-4 h-4" />
                  }
                  onPress={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    startContent={
                      <Icon icon="heroicons:check" className="w-4 h-4" />
                    }
                    onPress={handleSubmit(onSubmit)}
                    isLoading={saving}
                    isDisabled={!isValid || !isDirty}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setEditMode(false)
                      reset()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>

            <Divider />

            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="first_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="First Name"
                          placeholder="Enter your first name"
                          isRequired
                          isDisabled={!editMode}
                          isInvalid={!!errors.first_name}
                          errorMessage={errors.first_name?.message}
                        />
                      )}
                    />

                    <Controller
                      name="last_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Last Name"
                          placeholder="Enter your last name"
                          isRequired
                          isDisabled={!editMode}
                          isInvalid={!!errors.last_name}
                          errorMessage={errors.last_name?.message}
                        />
                      )}
                    />

                    <Controller
                      name="display_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Display Name"
                          placeholder="How should we address you?"
                          isDisabled={!editMode}
                          description="This name will be shown to other users"
                        />
                      )}
                    />

                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Gender"
                          placeholder="Select your gender"
                          isDisabled={!editMode}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0]
                            field.onChange(selectedValue || "")
                          }}
                        >
                          {genderOptions.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Biography"
                        placeholder="Tell us about yourself..."
                        minRows={3}
                        maxRows={6}
                        isDisabled={!editMode}
                        isInvalid={!!errors.bio}
                        errorMessage={errors.bio?.message}
                        description={`${field.value?.length || 0}/2000 characters`}
                      />
                    )}
                  />
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Professional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="job_title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Job Title"
                          placeholder="e.g., Software Engineer"
                          isDisabled={!editMode}
                          isInvalid={!!errors.job_title}
                          errorMessage={errors.job_title?.message}
                        />
                      )}
                    />

                    <Controller
                      name="company"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Company"
                          placeholder="e.g., ABC Technology"
                          isDisabled={!editMode}
                          isInvalid={!!errors.company}
                          errorMessage={errors.company?.message}
                        />
                      )}
                    />

                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Department"
                          placeholder="e.g., Engineering"
                          isDisabled={!editMode}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="City"
                          placeholder="e.g., San Francisco"
                          isDisabled={!editMode}
                        />
                      )}
                    />

                    <Controller
                      name="state_province"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="State/Province"
                          placeholder="e.g., California"
                          isDisabled={!editMode}
                        />
                      )}
                    />

                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Country"
                          placeholder="e.g., United States"
                          isDisabled={!editMode}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-medium mb-4">Social Links</h4>
                  <div className="space-y-4">
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Website"
                          placeholder="https://yourwebsite.com"
                          isDisabled={!editMode}
                          isInvalid={!!errors.website}
                          errorMessage={errors.website?.message}
                        />
                      )}
                    />

                    <Controller
                      name="linkedin_url"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="LinkedIn"
                          placeholder="https://linkedin.com/in/yourprofile"
                          isDisabled={!editMode}
                          isInvalid={!!errors.linkedin_url}
                          errorMessage={errors.linkedin_url?.message}
                        />
                      )}
                    />

                    <Controller
                      name="github_url"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="GitHub"
                          placeholder="https://github.com/yourusername"
                          isDisabled={!editMode}
                          isInvalid={!!errors.github_url}
                          errorMessage={errors.github_url?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={isCropOpen}
        onClose={onCropClose}
        image={imageFile}
        onSave={handleImageUpload}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Delete Profile Picture</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to remove your profile picture? This action
              cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleImageDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileForm
