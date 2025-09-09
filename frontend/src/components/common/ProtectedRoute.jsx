import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Spinner } from "@heroui/react"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

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

  return children
}

export default ProtectedRoute
