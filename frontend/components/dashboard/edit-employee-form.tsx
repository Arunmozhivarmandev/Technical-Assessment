"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import { employeeAPI } from "@/lib/api"

// ------------------------------------
// ZOD SCHEMA
// ------------------------------------
const employeeEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  designation: z.string().min(1, "Designation is required"),
  salary: z.number({ invalid_type_error: "Salary must be a number" }).positive("Salary must be positive"),
  image: z.instanceof(File).optional(),
})

type EmployeeEditFormValues = z.infer<typeof employeeEditSchema>

interface EditEmployeeFormProps {
  employeeId: string
}

// ------------------------------------
// COMPONENT
// ------------------------------------
export function EditEmployeeForm({ employeeId }: EditEmployeeFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeEditFormValues>({
    resolver: zodResolver(employeeEditSchema),
  })

  // ------------------------------------
  // Fetch employee details
  // ------------------------------------
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employee = await employeeAPI.getById(employeeId)

        setValue("name", employee.data.name)
        setValue("email", employee.data.email)
        setValue("phone", employee.data.phone)
        setValue("designation", employee.data.designation)
        setValue("salary", Number(employee.data.salary))

        if (employee.data.profileImage) setImagePreview(employee.data.profileImage)
      } catch (err: any) {
        setError(err?.message || "Failed to load employee")
      } finally {
        setFetching(false)
      }
    }

    loadEmployee()
  }, [employeeId, setValue])

  // ------------------------------------
  // Image Handler
  // ------------------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("image", file)

      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // ------------------------------------
  // Submit
  // ------------------------------------
  const onSubmit = async (data: EmployeeEditFormValues) => {
    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("designation", data.designation)
      formData.append("salary", data.salary.toString())

      if (data.image) {
        formData.append("profileImage", data.image)
      }

      await employeeAPI.update(employeeId, formData)

      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Failed to update employee")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center text-muted-foreground">Loading employee...</div>
  }

  return (
    <Card className="border border-border max-w-2xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image</label>

            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 rounded-lg bg-secondary border border-border overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>

              <Input type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input {...register("name")} placeholder="John Doe" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...register("email")} placeholder="john@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Designation</label>
              <Input {...register("designation")} placeholder="Senior Developer" />
              {errors.designation && <p className="text-sm text-destructive">{errors.designation.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Salary</label>
              <Input
                type="number"
                {...register("salary", { valueAsNumber: true })}
                placeholder="75000"
              />
              {errors.salary && <p className="text-sm text-destructive">{errors.salary.message}</p>}
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Employee"}
            </Button>

            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
