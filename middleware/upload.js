import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folder exists
const dir = "uploads/events";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

const upload = multer({ storage, fileFilter });
export default upload;
