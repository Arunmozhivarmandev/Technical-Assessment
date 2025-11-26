import { z } from "zod";

export const adminCreateUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.enum(["user", "admin"]).default("user")
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
