import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Spinner } from "@heroui/react"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

// TODO: Define the shape of the auth state in the Redux store
interface AuthState {
  isAuthenticated: boolean
  user: {
    role: string
  } | null
  loading: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  // TODO: Check Redux store shape
  const { isAuthenticated, user, loading } = useSelector(
    (state: { auth: AuthState }) => state.auth
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
