
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EditEmployeeForm } from "@/components/dashboard/edit-employee-form"

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Employee</h1>
          <p className="text-muted-foreground mt-2">Update employee information</p>
        </div>
        <EditEmployeeForm employeeId={(await params).id} />
      </div>
    </DashboardLayout>
  )
}
