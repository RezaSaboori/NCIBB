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
  // User, // removed
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
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام باید کمتر از ۵۰ کاراکتر باشد")
    .required("نام الزامی است"),
  last_name: yup
    .string()
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام خانوادگی باید کمتر از ۵۰ کاراکتر باشد")
    .required("نام خانوادگی الزامی است"),
  display_name: yup
    .string()
    .max(100, "نام نمایشی باید کمتر از ۱۰۰ کاراکتر باشد"),
  bio: yup.string().max(2000, "بیوگرافی باید کمتر از ۲۰۰۰ کاراکتر باشد"),
  job_title: yup.string().max(200, "عنوان شغلی باید کمتر از ۲۰۰ کاراکتر باشد"),
  company: yup.string().max(200, "نام شرکت باید کمتر از ۲۰۰ کاراکتر باشد"),
})

const genderOptions = [
  { key: "male", label: "مرد" },
  { key: "female", label: "زن" },
  { key: "other", label: "دیگر" },
  { key: "prefer_not_to_say", label: "ترجیح می دهم نگویم" },
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
      await onRefresh() // Refetch profile data
      await loadCompletionData()
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم فایل باید کمتر از ۵ مگابایت باشد")
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
    <div className="space-y-6 text-right">
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
                <h3 className="text-lg font-semibold">
                  {profile?.full_name || "کاربر ناشناس"}
                </h3>
                <p className="text-small text-default-500">
                  {profile?.job_title
                    ? `${profile.job_title}${profile.company ? ` در ${profile.company}` : ""}`
                    : "عنوان شغلی ثبت نشده است"}
                </p>
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
                  حذف عکس
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
                <h3 className="text-xl font-semibold">اطلاعات پروفایل</h3>
                <p className="text-small text-default-500">
                  اطلاعات شخصی و تنظیمات خود را به روز کنید
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
                  ویرایش پروفایل
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
                    ذخیره تغییرات
                  </Button>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setEditMode(false)
                      reset()
                    }}
                  >
                    لغو
                  </Button>
                </div>
              )}
            </CardHeader>

            <Divider />

            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-right">
                    اطلاعات پایه
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    dir="rtl"
                  >
                    <Controller
                      name="first_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="نام"
                          placeholder="نام خود را وارد کنید"
                          isRequired
                          isDisabled={!editMode}
                          isInvalid={!!errors.first_name}
                          errorMessage={errors.first_name?.message}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="last_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="نام خانوادگی"
                          placeholder="نام خانوادگی خود را وارد کنید"
                          isRequired
                          isDisabled={!editMode}
                          isInvalid={!!errors.last_name}
                          errorMessage={errors.last_name?.message}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="display_name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="نام نمایشی"
                          placeholder="چگونه شما را خطاب کنیم؟"
                          isDisabled={!editMode}
                          description="این نام به سایر کاربران نمایش داده خواهد شد"
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                            description: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="جنسیت"
                          placeholder="جنسیت خود را انتخاب کنید"
                          isDisabled={!editMode}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) => {
                            const selectedValue = Array.from(keys)[0]
                            field.onChange(selectedValue || "")
                          }}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            value: "text-right",
                            trigger: "text-right",
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
                        label="بیوگرافی"
                        placeholder="درباره خودتان به ما بگویید..."
                        minRows={3}
                        maxRows={6}
                        isDisabled={!editMode}
                        isInvalid={!!errors.bio}
                        errorMessage={errors.bio?.message}
                        description={`${field.value?.length || 0}/2000 کاراکتر`}
                        labelPlacement="outside"
                        classNames={{
                          label: "text-right",
                          input: "text-right",
                          description: "text-right",
                        }}
                      />
                    )}
                  />
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-right">
                    اطلاعات حرفه ای
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    dir="rtl"
                  >
                    <Controller
                      name="job_title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="عنوان شغلی"
                          placeholder="مثلا: مهندس نرم افزار"
                          isDisabled={!editMode}
                          isInvalid={!!errors.job_title}
                          errorMessage={errors.job_title?.message}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="company"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="شرکت"
                          placeholder="مثلا: شرکت فناوری ABC"
                          isDisabled={!editMode}
                          isInvalid={!!errors.company}
                          errorMessage={errors.company?.message}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="دپارتمان"
                          placeholder="مثلا: مهندسی"
                          isDisabled={!editMode}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-right">مکان</h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    dir="rtl"
                  >
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="شهر"
                          placeholder="مثلا: تهران"
                          isDisabled={!editMode}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="state_province"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="استان"
                          placeholder="مثلا: تهران"
                          isDisabled={!editMode}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="کشور"
                          placeholder="مثلا: ایران"
                          isDisabled={!editMode}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-right",
                            input: "text-right",
                          }}
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

      <Modal isOpen={isCropOpen} onOpenChange={onCropClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تصویر پروفایل
              </ModalHeader>
              <ModalBody>
                <ImageCropModal
                  imageFile={imageFile}
                  onCropComplete={handleImageUpload}
                  onClose={onClose}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  لغو
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                حذف عکس پروفایل
              </ModalHeader>
              <ModalBody>
                <p>
                  آیا از حذف عکس پروفایل اطمینان دارید؟ این عمل برگشت پذیر نیست.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleImageDelete}>
                  حذف
                </Button>
                <Button color="primary" variant="flat" onPress={onClose}>
                  لغو
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileForm
