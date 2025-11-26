"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { employeeAPI } from "@/lib/api"
import { AlertCircle } from "lucide-react"

// --- Zod schema ---
const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  designation: z.string().min(1, "Designation is required"),
  salary: z.number({ invalid_type_error: "Salary must be a number" }).positive("Salary must be positive"),
  image: z.instanceof(File).optional(),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

export function AddEmployeeForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      salary: undefined,
      image: undefined,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: EmployeeFormValues) => {
    setError("")
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("designation", data.designation)
      formData.append("salary", data.salary.toString())
      if (data.image) formData.append("profileImage", data.image)

      await employeeAPI.create(formData)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add employee")
    }
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

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image</label>
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 rounded-lg bg-secondary border border-border flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="+1 (555) 000-0000" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Designation</label>
              <Input placeholder="Senior Developer" {...register("designation")} />
              {errors.designation && <p className="text-sm text-destructive">{errors.designation.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Salary</label>
              <Input type="number" placeholder="75000" {...register("salary", { valueAsNumber: true })} />
              {errors.salary && <p className="text-sm text-destructive">{errors.salary.message}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
