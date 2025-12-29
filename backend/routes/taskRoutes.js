import express from "express";
import { createTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId/tasks", authMiddleware, createTask);

export default router;
