"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { employeeAPI } from "@/lib/api"
import { AlertCircle, Edit, Trash2 } from "lucide-react"

interface EmployeeDetailsViewProps {
  employeeId: string
}

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  designation: string
  salary: number
  createdAt: string
  profileImage: string,
  updatedAt: string
}

export function EmployeeDetailsView({ employeeId }: EmployeeDetailsViewProps) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeAPI.getById(employeeId)
        setEmployee(response.data)
      } catch (err: any) {
        setError(err?.message || "Failed to load employee")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [employeeId])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      await employeeAPI.delete(employeeId)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete employee")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return <div className="text-center text-muted-foreground py-8">Loading employee...</div>
  }

  if (!employee) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>{error || "Employee not found"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Details</h1>
        </div>
        <div className="flex gap-3">

          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border border-border">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile */}
            <div className="md:col-span-1 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={employee.profileImage || "/placeholder.svg"} alt={employee.name} className="w-full h-full object-cover object-center"
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-bold text-foreground text-center">{employee.name}</h2>
              <p className="text-muted-foreground text-center mt-1">{employee.designation}</p>
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Email</p>
                  <p className="text-foreground break-all">{employee.email}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Phone</p>
                  <p className="text-foreground">{employee.phone}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Designation</p>
                  <p className="text-foreground">{employee.designation}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Salary</p>
                  <p className="text-foreground font-semibold">${employee.salary.toLocaleString()}</p>
                </div>


              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
