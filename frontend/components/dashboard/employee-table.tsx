"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Eye } from "lucide-react"

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

interface EmployeeTableProps {
  employees: Employee[]
  onDelete: any,
  hideActions?: boolean
}

export function EmployeeTable({ employees, onDelete, hideActions }: EmployeeTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <table className="w-full">
      <thead className="bg-secondary border-b border-border">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Designation</th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Salary</th>
          <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 overflow-hidden">
                  <AvatarImage
                    src={employee.profileImage || "/placeholder.svg"}
                    alt={employee.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <AvatarFallback>{employee.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.phone}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-foreground">{employee.email}</td>
            <td className="px-6 py-4 text-sm text-foreground">{employee.designation}</td>
            <td className="px-6 py-4 text-sm font-medium text-foreground">${employee.salary.toLocaleString()}</td>

            <td className="px-6 py-4 text-right">

              <div className="flex items-center justify-end gap-2">
                <Link href={`/dashboard/employees/${employee.id}`}>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent" title="View Details">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                {hideActions && (
                  <>
                    <Link href={`/dashboard/employees/${employee.id}/edit`}>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => onDelete(employee.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button></>)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
