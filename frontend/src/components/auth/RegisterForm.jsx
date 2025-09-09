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
import { registerUser, clearError } from "../../store/slices/authSlice"
import { useNavigate } from "react-router-dom"

const schema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  phone: yup.string(),
})

const RegisterForm = () => {
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
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-default-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="justify-center">
          <h1 className="text-xl font-semibold">Register</h1>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="mb-3 rounded-md border border-danger-300 bg-danger-50 p-2 text-danger-600 text-sm">
              <div className="flex justify-between items-start gap-2">
                <span>
                  {error.detail || error.message || "Registration failed"}
                </span>
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <Input
              label="First Name"
              isInvalid={!!errors.first_name}
              errorMessage={errors.first_name?.message}
              {...register("first_name")}
            />
            <Input
              label="Last Name"
              isInvalid={!!errors.last_name}
              errorMessage={errors.last_name?.message}
              {...register("last_name")}
            />
            <Input
              label="Username"
              isInvalid={!!errors.username}
              errorMessage={errors.username?.message}
              {...register("username")}
            />
            <Input
              label="Phone"
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              className="sm:col-span-2"
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
            <Input
              type="password"
              label="Confirm Password"
              isInvalid={!!errors.password_confirm}
              errorMessage={errors.password_confirm?.message}
              {...register("password_confirm")}
            />
            <div className="sm:col-span-2 mt-2">
              <Button
                type="submit"
                color="primary"
                fullWidth
                disabled={loading}
                disableRipple
              >
                {loading ? <Spinner size="sm" /> : "Register"}
              </Button>
            </div>
            <div className="sm:col-span-2 text-center text-sm">
              <Link href="/login">Already have an account? Sign in</Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

export default RegisterForm
