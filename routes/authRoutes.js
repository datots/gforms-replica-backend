// src/routes/authRoutes.js
import express from "express";
import { register, login } from "../controller/authController.js"; // Ensure the path and file extension are correct

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router; // Use ES module export syntax
