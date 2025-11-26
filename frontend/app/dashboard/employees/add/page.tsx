"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AddEmployeeForm } from "@/components/dashboard/add-employee-form"

export default function AddEmployeePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Add New Employee</h1>
          <p className="text-muted-foreground mt-2">Fill in the form below to add a new employee</p>
        </div>
        <AddEmployeeForm />
      </div>
    </DashboardLayout>
  )
}
