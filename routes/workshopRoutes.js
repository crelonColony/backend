import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/workshopUpload.js";
import {
  createWorkshop,
  getAllWorkshops,
  getLatestWorkshops,
  updateWorkshop,
  deleteWorkshop,
  registerWorkshop
} from "../controllers/workshopController.js";

const router = express.Router();

// Admin routes
router.post("/", protect, adminOnly, upload.single("image"), createWorkshop);
router.put("/:id", protect, adminOnly, upload.single("image"), updateWorkshop);
router.delete("/:id", protect, adminOnly, deleteWorkshop);

// Student routes
router.get("/", getAllWorkshops);
router.get("/latest", getLatestWorkshops);
router.post("/:id/register", protect, registerWorkshop);

export default router;
