import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadInternship.js";
import {
  createInternship,
  getAllInternships,
  getLatestInternships,
  updateInternship,
  deleteInternship,
  applyInternship,
  getAppliedInternships
} from "../controllers/internshipController.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), createInternship);
router.get("/",  protect, getAllInternships);
router.get("/latest", protect, getLatestInternships);
router.put("/:id", protect, adminOnly, upload.single("image"), updateInternship);
router.delete("/:id", protect, adminOnly, deleteInternship);
router.post("/:id/apply", protect, upload.single("resume"), applyInternship);
router.get("/applied", protect, getAppliedInternships);

export default router;
