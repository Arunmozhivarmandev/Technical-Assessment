import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import { signToken } from "../utils/token.util";
import { registerSchema, loginSchema } from "../validators/auth.validator";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: parsed.email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = new User({ ...parsed });
    await user.save();
    const token = signToken({ id: user._id.toString(), role: user.role });
     res.cookie("token", token, {
    httpOnly: true,
    secure: false,         
    sameSite: "lax",      
    path: "/",
  });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role:  user.role}, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await User.findOne({ email: parsed.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
console.log("working")
    const ok = await user.comparePassword(parsed.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie("token", token, {
    httpOnly: true,
    secure: false,         
    sameSite: "lax",      
    path: "/",
  });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
}
