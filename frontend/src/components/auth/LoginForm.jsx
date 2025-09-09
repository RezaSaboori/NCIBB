import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Spinner,
  Link,
} from "@heroui/react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearError } from "../../store/slices/authSlice"
import { useNavigate } from "react-router-dom"

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-default-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="justify-center">
          <h1 className="text-xl font-semibold">Login</h1>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="mb-3 rounded-md border border-danger-300 bg-danger-50 p-2 text-danger-600 text-sm">
              <div className="flex justify-between items-start gap-2">
                <span>{error.detail || error.message || "Login failed"}</span>
                <button
                  type="button"
                  className="text-danger-600 hover:underline"
                  onClick={() => dispatch(clearError())}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              label="Email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register("email")}
            />
            <Input
              type="password"
              label="Password"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              color="primary"
              fullWidth
              disabled={loading}
              disableRipple
            >
              {loading ? <Spinner size="sm" /> : "Login"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/register">Don't have an account? Sign up</Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

export default LoginForm
