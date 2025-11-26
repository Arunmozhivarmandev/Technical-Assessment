import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

// ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // keep original extension and prefix with timestamp
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

function fileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // accept only image mimetypes
  if (/^image\/(jpeg|png|webp|gif|jpg)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"));
}

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter
});
