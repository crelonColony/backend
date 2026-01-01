// routes/userRoutes.js
import express from "express";
import { createUser, getAllUsers, updateUserRole, deleteUser, getMentors  } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/mentors", protect, adminOnly, getMentors);

export default router;
