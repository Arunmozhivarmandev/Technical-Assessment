import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.util";
import User from "../models/User.model";

export async function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
    const token = auth.split(" ")[1];
    const decoded = verifyToken<{ id: string; role: string }>(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    // attach
    (req as any).user = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
    return res.status(401).json({ message: "Invalid token" });
  }
}
