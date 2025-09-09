import React, { useState, useEffect } from "react"
import api from "../../services/api"
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react"

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
    fetchUsers()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/core/admin-stats/")
      setAdminData(response.data)
    } catch (error) {
      console.error("Error fetching admin data:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users/")
      setUsers(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/auth/users/${userId}/`, { is_active: newStatus })
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Spinner label="Loading admin stats..." />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl">{adminData?.total_users || 0}</p>
            <p className="text-sm text-default-500">Total Users</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl">{adminData?.total_projects || 0}</p>
            <p className="text-sm text-default-500">Total Projects</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl">${adminData?.total_credits || "0.00"}</p>
            <p className="text-sm text-default-500">Total Credits</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl">{adminData?.active_users || 0}</p>
            <p className="text-sm text-default-500">Active Users</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <p className="font-medium">User Management</p>
        </CardHeader>
        <CardBody>
          <Table aria-label="Users table">
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip color="primary" variant="flat" size="sm">
                      {user.role}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={user.is_active ? "success" : "danger"}
                      size="sm"
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="bordered"
                      disableRipple
                      onClick={() =>
                        handleUserStatusChange(user.id, !user.is_active)
                      }
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminDashboard
