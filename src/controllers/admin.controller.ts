import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import { adminCreateUserSchema } from "../validators/adminCreateUser";

export async function createAdminUser(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate input
    const parsed = adminCreateUserSchema.parse(req.body);

    // Prevent duplicate email
    const exists = await User.findOne({ email: parsed.email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new user (password hashing happens automatically in pre-save hook)
    const user = new User(parsed);
    await user.save();

    // Hide password in response
    const { password, ...safeUser } = user.toObject();

    return res.status(201).json({
      message: "User created successfully",
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
}
