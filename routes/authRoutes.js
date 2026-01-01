import express from "express";
import { register, login, logout } from "../controllers/authController.js";
// import { deleteUser } from "../controllers/userController.js";
// import { protect } from "../middleware/authMiddleware.js";
// import {updateUserRole} from "../controllers/userController.js"


import { updateUserRole, createUser, getAllUsers, deleteUser } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.delete("/:id", protect, deleteUser);
router.put("/:id/role", updateUserRole); 
router.post("/logout", logout);


router.get("/users", protect, adminOnly, getAllUsers);
router.post("/create-user", protect, adminOnly, createUser); // ✅ create mentor/member
// router.put("/user/${id}", protect, adminOnly, updateUserRole);
// router.delete("/${id}/role", protect, adminOnly, deleteUser);


export default router;
