import mongoose, { Document, Model } from "mongoose";

export interface IEmployee {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  salary?: number;
  profileImage?: string;
}

export interface EmployeeDoc extends IEmployee, Document {}

const employeeSchema = new mongoose.Schema<EmployeeDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },
    salary: { type: Number, min: 0 },
    profileImage: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Employee: Model<EmployeeDoc> = mongoose.model<EmployeeDoc>("Employee", employeeSchema);
export default Employee;
