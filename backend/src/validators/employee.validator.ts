import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  salary: z.number().nonnegative().optional(),
  profileImage: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
