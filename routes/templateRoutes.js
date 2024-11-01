// templateRoutes.js
import express from "express";
import {
  createTemplate,
  getAllTemplates,
  deleteTemplate,
} from "../controller/templateController.js"; // Ensure this path and extension are correct

const router = express.Router();

router.post("/", createTemplate);
router.get("/", getAllTemplates);
router.delete("/:id", deleteTemplate);

export default router;
