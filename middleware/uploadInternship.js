import multer from "multer";
import fs from "fs";
import path from "path";

const dir = "uploads/internships";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only images and PDF resumes allowed"), false);
};

const upload = multer({ storage, fileFilter });
export default upload;
