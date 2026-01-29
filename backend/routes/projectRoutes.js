import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectTasks,
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);
router.get("/:id/tasks", authMiddleware, getProjectTasks);

export default router;
