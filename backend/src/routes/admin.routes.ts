import { Router } from "express";
import { createAdminUser } from "../controllers/admin.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { adminOnly } from "../middlewares/adminonly.middleware";

const router = Router();

// Admin creates user (admin or normal user)
router.post("/create-user", jwtMiddleware, adminOnly, createAdminUser);

export default router;
