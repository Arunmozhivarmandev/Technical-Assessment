"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmployeeTable } from "@/components/dashboard/employee-table"
import { Pagination } from "@/components/dashboard/pagination"
import { employeeAPI } from "@/lib/api"
import { Search, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/context"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  designation: string
  salary: number
  profileImage: string
  createdAt: string
  updatedAt: string
}

export function EmployeeListView() {
  const router = useRouter()
  const { user } = useAuth() // ✅ get current user
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("name")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchEmployees = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await employeeAPI.getList({
        search: search || undefined,
        sort: sort || undefined,
        page,
        limit: 10,
      })

      const data = response.data
      setEmployees(data)
      setTotalPages(response.meta.pages)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch employees")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    fetchEmployees()
  }, [search, sort, page])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      await employeeAPI.delete(id)
      fetchEmployees()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete employee")
    }
  }

  const isUser = user?.role === "user" // 🔥 check role

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your employee directory</p>
        </div>
        {!isUser && (
          <Link href="/dashboard/employees/add">
            <Button size="lg">Add Employee</Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="-name">Name (Z-A)</SelectItem>
                <SelectItem value="salary">Salary (Low to High)</SelectItem>
                <SelectItem value="-salary">Salary (High to Low)</SelectItem>
                <SelectItem value="designation">Designation</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearch("")
                setSort("name")
              }}
              variant="outline"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="border border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No employees found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <EmployeeTable
                  employees={employees}
                  onDelete={isUser ? undefined : handleDelete} // hide delete
                  hideActions={isUser} // pass a prop to hide Edit/Delete buttons in table
                />
              </div>
              <div className="border-t border-border p-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
