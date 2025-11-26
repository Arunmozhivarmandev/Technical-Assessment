import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation error", errors: messages });
  }

  if (err.code && err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(", ");
    return res.status(StatusCodes.CONFLICT).json({ message: `Duplicate field(s): ${fields}` });
  }

  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(status).json({ message: err.message || "Internal Server Error" });
}
