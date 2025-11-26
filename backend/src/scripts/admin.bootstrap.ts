// src/bootstrap/admin.bootstrap.ts
import bcrypt from "bcryptjs";
import User from "../models/User.model";

export async function adminBootstrap() {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists. Skipping bootstrap.");
      return;
    }

    

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
    });

    console.log("Default Admin Created", admin);
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");
  } catch (err) {
    console.error("Admin bootstrap failed:", err);
  }
}
