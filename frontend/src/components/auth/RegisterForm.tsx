import { Input, Button } from "@heroui/react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/authService"
import { loginSuccess } from "../../store/authSlice"
import { fetchUserProfile } from "../../store/profileSlice"
import { AppDispatch } from "../../store/store"
import { SocialButtons } from "./SocialButtons"
import { useState } from "react"

type RegisterFormFields = {
  username: string
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirm: string
}

type ServerErrorValue = string | string[] | null | undefined
type ServerError = Record<string, ServerErrorValue> | string

const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
})

const RegisterForm = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<ServerError | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormFields) => {
    try {
      const userData = await authService.register(data)
      localStorage.setItem("access_token", userData.access)
      localStorage.setItem("refresh_token", userData.refresh)
      dispatch(loginSuccess(userData))
      dispatch(fetchUserProfile())
      navigate("/profile")
    } catch (error: any) {
      console.error("Registration failed:", error)
      setServerError(error?.response?.data ?? "An unexpected error occurred.")
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">
            {typeof serverError === "string" ? (
              <span>{serverError}</span>
            ) : (
              Object.entries(serverError).map(([key, value]) => {
                const normalized = Array.isArray(value)
                  ? value.join(", ")
                  : (value ?? "")
                return <div key={key}>{`${key}: ${normalized}`}</div>
              })
            )}
          </span>
        </div>
      )}
      <Controller
        name="username"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Username"
            placeholder="Enter your username"
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
          />
        )}
      />
      <div className="flex gap-4">
        <Controller
          name="first_name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              isRequired
              label="First Name"
              placeholder="Enter your first name"
              isInvalid={!!errors.first_name}
              errorMessage={errors.first_name?.message}
            />
          )}
        />
        <Controller
          name="last_name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              isRequired
              label="Last Name"
              placeholder="Enter your last name"
              isInvalid={!!errors.last_name}
              errorMessage={errors.last_name?.message}
            />
          )}
        />
      </div>
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Email"
            placeholder="Enter your email"
            type="email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Password"
            placeholder="Enter your password"
            type="password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
        )}
      />
      <Controller
        name="password_confirm"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            isInvalid={!!errors.password_confirm}
            errorMessage={errors.password_confirm?.message}
          />
        )}
      />
      <Button color="primary" type="submit">
        Sign Up
      </Button>
      <div className="flex items-center gap-4">
        <hr className="w-full" />
        <span>Or</span>
        <hr className="w-full" />
      </div>
      <SocialButtons />
    </form>
  )
}

export default RegisterForm
