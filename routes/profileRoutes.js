import express from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer config for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // your upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", protect, getProfile);
router.put("/", protect, upload.single("profileImage"), updateProfile); 
router.delete("/", protect, deleteProfile);

export default router;
