import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createEvent,
  getAllEvents,
  getLatestEvents,
  updateEvent,
  deleteEvent,
  registerEvent
} from "../controllers/eventController.js";

const router = express.Router();

// Admin routes
router.post("/", protect, adminOnly, upload.single("image"), createEvent);
router.put("/:id", protect, adminOnly, upload.single("image"), updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

// Student routes
router.get("/", protect, getAllEvents);
router.get("/latest", protect, getLatestEvents);
router.post("/:id/register", protect, registerEvent);

export default router;
