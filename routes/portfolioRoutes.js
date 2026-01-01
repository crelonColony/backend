import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  savePortfolio,
  getPortfolioByUsername,
  generateResumePDF,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.post("/", protect, savePortfolio);
router.get("/:username", getPortfolioByUsername); // public page
router.get("/resume/download", protect, generateResumePDF);

export default router;
