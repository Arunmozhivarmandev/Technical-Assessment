
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmployeeDetailsView } from "@/components/dashboard/employee-details-view"

export default async function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  
  return (
    <DashboardLayout>
      <EmployeeDetailsView employeeId={(await params).id} />
    </DashboardLayout>
  )
}
