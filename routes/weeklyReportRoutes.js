import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/reportUpload.js";
import {
  submitWeeklyReport,
  getStudentReports,
  getAllReports,
} from "../controllers/weeklyReportController.js";

const router = express.Router();

router.post("/submit", protect, upload.single("file"), submitWeeklyReport);
router.get("/myreports", protect, getStudentReports);
router.get("/all", protect, adminOnly, getAllReports);

export default router;
