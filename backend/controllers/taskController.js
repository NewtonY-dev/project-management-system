import db from "../config/db.js";

// Validation helper function
const validateTaskInput = (title, description) => {
  const errors = {};

  // Check title exists and is valid
  if (!title || title.trim() === "") {
    errors.title = "Task title is required";
  } else if (title.length > 255) {
    errors.title = "Title cannot exceed 255 characters";
  }

  // Check description format if provided
  if (description && typeof description !== "string") {
    errors.description = "Description must be text";
  }

  return errors;
};

// Main create task function
export const createTask = async (req, res) => {
  try {
    // 1. Check user role
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can create tasks",
      });
    }

    // 2. Validate project ID
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({
        error: `Invalid project ID : ${req.params.projectId}`,
      });
    }

    // 3. Validate task data
    const { title, description } = req.body;
    const validationErrors = validateTaskInput(title, description);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const cleanTitle = title.trim();
    const cleanDescription = description ? description.trim() : null;

    // 4. Check project exists and user owns it
    const [projects] = await db.query(
      "SELECT id, title, owner_id FROM projects WHERE id = ?",
      [projectId]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const project = projects[0];

    if (project.owner_id !== req.user.id) {
      return res.status(403).json({
        error: "You can only add tasks to your own projects",
      });
    }

    // 5. Insert task
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, status, project_id) VALUES (?, ?, 'todo', ?)",
      [cleanTitle, cleanDescription, projectId]
    );

    // 6. Get and return task
    const [tasks] = await db.query(
      "SELECT id, title, description, status, project_id, assignee_id, created_at, updated_at FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(tasks[0]);
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};
