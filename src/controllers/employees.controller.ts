import { Request, Response, NextFunction } from "express";
import Employee from "../models/Employee.model";
import { createEmployeeSchema, updateEmployeeSchema } from "../validators/employee.validator";
import path from "path";
import fs from "fs";

/**
 * Helper to convert multer file to stored path returned to client
 */
function fileToUrl(file: Express.Multer.File | undefined) {
  if (!file) return undefined;
  // store relative URL so it works on any host (you can prefix with full host in responses if needed)
  // file.filename exists when using diskStorage filename
  return `/uploads/${path.basename(file.path)}`;
}

export async function listEmployees(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "10", search, sort, ...filters } = req.query as any;
    const q: any = {};

    // parse filters
    Object.entries(filters).forEach(([k, v]) => {
      if (v === "true" || v === "false") q[k] = v === "true";
      else if (!isNaN(v as any)) q[k] = Number(v);
      else q[k] = v;
    });

    if (search) {
      const regex = new RegExp(String(search), "i");
      q.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { position: regex }];
    }

    let sortObj: any = { createdAt: -1 };
    if (sort) {
      const [field, order] = String(sort).split(":");
      sortObj = { [field]: order === "asc" ? 1 : -1 };
    }

    const p = Math.max(Number(page), 1);
    const lim = Math.min(Number(limit), 100);
    const skip = (p - 1) * lim;

    const [items, total] = await Promise.all([
      Employee.find(q).select("-__v").sort(sortObj).skip(skip).limit(lim),
      Employee.countDocuments(q)
    ]);

    const data = items.map((e:any) => {
      const { _id, ...rest } = e._doc;
      return {
        id: _id,  // rename _id → id
        ...rest   // include all other fields 
      };
    });


    res.json({ data, meta: { total, page: p, limit: lim, pages: Math.ceil(total / lim) } });
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    // If request is multipart/form-data, non-file fields may be strings, so parse/convert:
    // Build a body object for validation with correct types
    const incoming = {
      ...req.body,
      // salary might be sent as string; convert if present
      salary: req.body.salary !== undefined ? Number(req.body.salary) : undefined,
      active: req.body.active !== undefined ? req.body.active === "true" || req.body.active === true : undefined
    };

    const parsed = createEmployeeSchema.parse(incoming);

    // handle file
    const profileImagePath = fileToUrl(req.file);

    const existing = await Employee.findOne({ email: parsed.email });
    if (existing) {
      // cleanup uploaded file if exists (to avoid orphan)
      if (req.file && req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(409).json({ message: "Employee with this email already exists" });
    }

    const created = await Employee.create({ ...parsed, profileImage: profileImagePath } as any);
    res.status(201).json({ data: created });
  } catch (err) {
    // If multer produced file and we have error, remove file to avoid orphan files
    if (req.file && (req.file as any).path && fs.existsSync((req.file as any).path)) {
      fs.unlinkSync((req.file as any).path);
    }
    next(err);
  }
}

export async function updateEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const incoming = {
      ...req.body,
      salary: req.body.salary !== undefined ? Number(req.body.salary) : undefined,
    };

    const parsed = updateEmployeeSchema.parse(incoming);
    const emp = await Employee.findById(id);
    if (!emp) {
      // cleanup new file
      if (req.file && (req.file as any).path && fs.existsSync((req.file as any).path)) fs.unlinkSync((req.file as any).path);
      return res.status(404).json({ message: "Employee not found" });
    }

    // If new file uploaded, remove old file (if exists) and set new path
    if (req.file) {
      if (emp.profileImage) {
        // profileImage is like '/uploads/filename.ext'
        const oldFilename = path.basename(emp.profileImage);
        const oldPath = path.join(__dirname, "..", "..", "uploads", oldFilename);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { /* ignore cleanup errors */ }
        }
      }
      (parsed as any).profileImage = fileToUrl(req.file);
    }

    const updated = await Employee.findByIdAndUpdate(id, parsed as any, { new: true, runValidators: true });
    res.json({ data: updated });
  } catch (err) {
    if (req.file && (req.file as any).path && fs.existsSync((req.file as any).path)) fs.unlinkSync((req.file as any).path);
    next(err);
  }
}

export async function deleteEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
}

export async function getEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const emp = await Employee.findById(id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json({ data: emp });
  } catch (err) {
    next(err);
  }
}
