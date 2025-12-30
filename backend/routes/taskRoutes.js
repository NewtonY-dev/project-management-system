import express from "express";
import { createTask, assignTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId/tasks", authMiddleware, createTask);

router.put("/:taskId/assign", authMiddleware, assignTask);

export default router;
