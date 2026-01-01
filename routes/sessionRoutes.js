import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  bookSession,
  assignMentor,
  scheduleMeeting,
  getAllSessions,
  getStudentSessions,
  getMentorSessions
} from "../controllers/sessionController.js";

const router = express.Router();

// Student
router.post("/book", protect, bookSession);
router.get("/my-sessions", protect, getStudentSessions);

// Mentor
router.get("/mentor", protect, getMentorSessions);

// Admin
router.get("/all", protect, adminOnly, getAllSessions);
router.put("/:id/assign", protect, adminOnly, assignMentor);
router.put("/:id/schedule", protect, adminOnly, scheduleMeeting);

export default router;
