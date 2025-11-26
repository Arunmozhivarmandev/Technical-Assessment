import { Router } from "express";
import {
  listEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
} from "../controllers/employees.controller";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { upload } from "../config/multer";

const router = Router();

// protected reads
router.get("/", jwtMiddleware, listEmployees);
router.get("/:id", jwtMiddleware, getEmployee);

// admin-only
router.post("/", jwtMiddleware, requireRole("admin"), upload.single("profileImage"), createEmployee);
router.put("/:id", jwtMiddleware, requireRole("admin"), upload.single("profileImage"), updateEmployee);
router.delete("/:id", jwtMiddleware, requireRole("admin"), deleteEmployee);

export default router;
