import express from "express";
import {
  createTask,
  assignTask,
  getMyTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId/tasks", authMiddleware, createTask);

router.put("/:taskId/assign", authMiddleware, assignTask);

router.get("/me", authMiddleware, getMyTasks);

router.put("/:taskId/status", authMiddleware, updateTaskStatus);

export default router;
