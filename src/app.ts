import express from "express";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employees.routes";
import adminRoutes from "./routes/admin.routes";

import { errorHandler } from "./middlewares/error.middleware";

const app = express();
const uploadsPath = path.join(__dirname, "..", "uploads");

app.use("/uploads", express.static(uploadsPath));

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);

// central error handler
app.use(errorHandler);

export default app;

