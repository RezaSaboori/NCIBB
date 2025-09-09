import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDashboardData } from "../../store/slices/authSlice"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Chip,
  Spinner,
  Divider,
} from "@heroui/react"

const UserDashboard = () => {
  const dispatch = useDispatch()
  const { user, dashboardData, loading, error } = useSelector(
    (state) => state.auth
  )
  useEffect(() => {
    if (!dashboardData) {
      dispatch(getDashboardData())
    }
  }, [dispatch, dashboardData])

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Spinner label="Loading dashboard..." />
      </div>
    )
  }

  // Show error if there's one
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-lg font-semibold">
          Error loading dashboard: {error.message || String(error)}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold">
        Welcome back, {user?.first_name || "User"}!
      </h1>

      <div>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-default-500">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="justify-center">
              <Avatar
                src={user?.avatar}
                className="h-20 w-20"
                name={`${user?.first_name || ""} ${user?.last_name || ""}`}
              />
            </CardHeader>
            <CardBody className="text-center">
              <p className="text-base font-medium">
                {user?.get_full_name ||
                  `${user?.first_name || ""} ${user?.last_name || ""}`}
              </p>
              <div className="mt-2 flex justify-center">
                <Chip color="primary" variant="flat">
                  {user?.role || "user"}
                </Chip>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                color="primary"
                variant="bordered"
                disableRipple
              >
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <p className="font-medium">Your Credits</p>
            </CardHeader>
            <CardBody>
              <p className="text-3xl text-primary">
                {dashboardData?.credits?.balance ||
                  user?.credits?.balance ||
                  "0.00"}
              </p>
              <p className="text-sm text-default-500">
                Total Earned:{" "}
                {dashboardData?.credits?.total_earned ||
                  user?.credits?.total_earned ||
                  "0.00"}
              </p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="bordered" disableRipple>
                View History
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <p className="font-medium">Your Projects</p>
            </CardHeader>
            <CardBody>
              <p className="text-3xl text-primary">
                {dashboardData?.projects?.active_count ||
                  user?.projects?.active_count ||
                  0}
              </p>
              <p className="text-sm text-default-500">Active Projects</p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="bordered" disableRipple>
                View All
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Divider className="my-2" />

      <div>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-default-500">
          Details
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <p className="font-medium">Recent Messages</p>
            </CardHeader>
            <CardBody className="space-y-2">
              {(dashboardData?.recent_messages || user?.recent_messages || [])
                .length > 0 ? (
                (
                  dashboardData?.recent_messages ||
                  user?.recent_messages ||
                  []
                ).map((message) => (
                  <Card key={message.id} className="border border-default-200">
                    <CardBody className="py-3">
                      <p className="text-sm font-medium">{message.subject}</p>
                      <p className="text-xs text-default-500">
                        From: {message.sender_name}
                      </p>
                      <p className="text-xs text-default-400">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-default-500">No recent messages</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <p className="font-medium">Quick Actions</p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="bordered" disableRipple>
                  New Project
                </Button>
                <Button variant="bordered" disableRipple>
                  Browse Services
                </Button>
                <Button variant="bordered" disableRipple>
                  Send Message
                </Button>
                <Button variant="bordered" disableRipple>
                  View Reports
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
