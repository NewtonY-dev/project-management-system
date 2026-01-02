import express from "express";
import {
  createTask,
  assignTask,
  getMyTasks,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId/tasks", authMiddleware, createTask);

router.put("/:taskId/assign", authMiddleware, assignTask);

router.get("/me", authMiddleware, getMyTasks);

export default router;
