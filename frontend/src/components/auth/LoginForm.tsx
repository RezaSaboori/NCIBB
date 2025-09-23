import { Input, Button, Link, useDisclosure } from "@heroui/react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch } from "react-redux"
import { authService } from "../../services/authService"
import { loginSuccess } from "../../store/authSlice"
import { fetchUserProfile } from "../../store/profileSlice"
import { AppDispatch } from "../../store/store"
import { SocialButtons } from "./SocialButtons"
import { ForgotPasswordModal } from "./modal/ForgotPasswordModal"

type LoginFormFields = {
  email: string
  password: string
}

type LoginFormProps = {
  onLoginSuccess?: () => void
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
})

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const dispatch: AppDispatch = useDispatch()
  const {
    isOpen: isForgotPasswordOpen,
    onOpen: onForgotPasswordOpen,
    onOpenChange: onForgotPasswordOpenChange,
  } = useDisclosure()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormFields) => {
    try {
      const userData = await authService.login(data)
      localStorage.setItem("access_token", userData.access)
      localStorage.setItem("refresh_token", userData.refresh)
      dispatch(loginSuccess(userData))
      dispatch(fetchUserProfile())
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error) {
      console.error("Login failed:", error)
      // Handle login error (e.g., show an error message)
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="flex items-center justify-between">
          <Link
            href="#"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              onForgotPasswordOpen()
            }}
          >
            Forgot password?
          </Link>
        </div>
        <Button color="primary" type="submit">
          Sign In
        </Button>
        <div className="flex items-center gap-4">
          <hr className="w-full" />
          <span>Or</span>
          <hr className="w-full" />
        </div>
        <SocialButtons />
      </form>
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onOpenChange={onForgotPasswordOpenChange}
      />
    </>
  )
}

export default LoginForm
