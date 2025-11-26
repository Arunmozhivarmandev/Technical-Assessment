"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmployeeListView } from "@/components/dashboard/employee-list-view"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <EmployeeListView />
    </DashboardLayout>
  )
}
