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

// Assign task to team member
export const assignTask = async (req, res) => {
  try {
    // 1. Check user is Project Manager
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can assign tasks",
      });
    }

    // 2. Get and validate task ID
    const taskId = parseInt(req.params.taskId);
    if (isNaN(taskId) || taskId <= 0) {
      return res.status(400).json({
        error: "Invalid task ID",
      });
    }

    // 3. Get and validate assignee ID
    const { assignee_id } = req.body;

    if (!assignee_id) {
      return res.status(400).json({
        error: "Assignee ID is required",
      });
    }

    if (
      typeof assignee_id !== "number" ||
      assignee_id <= 0 ||
      !Number.isInteger(assignee_id)
    ) {
      return res.status(400).json({
        error: "Assignee ID must be a positive integer",
      });
    }

    // 4. Prevent PM self-assignment
    if (assignee_id === req.user.id) {
      return res.status(400).json({
        error: "You cannot assign tasks to yourself",
        details: "Project Managers cannot be task assignees",
      });
    }

    // 5. Check task exists and get project info
    const [tasks] = await db.query(
      `SELECT t.*, 
    p.owner_id as project_owner_id, 
    p.title as project_title  
   FROM tasks t
   JOIN projects p ON t.project_id = p.id
   WHERE t.id = ?`,
      [taskId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        error: "Task not found",
        details: `No task exists with ID ${taskId}`,
      });
    }

    const task = tasks[0];

    // 7. Check PM owns the task's project
    if (task.project_owner_id !== req.user.id) {
      return res.status(403).json({
        error: "You can only assign tasks in your own projects",
        details: `You do not own project "${task.project_title}"`,
      });
    }

    // 6. Check if already assigned to same person
    if (task.assignee_id === assignee_id) {
      return res.status(400).json({
        error: "Task is already assigned to this team member",
        assignee_id: assignee_id,
        current_status: "Already assigned",
      });
    }

    // 8. Check assignee exists and is a team member
    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [assignee_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: "Team member not found",
        details: `No user exists with ID ${assignee_id}`,
      });
    }

    const assignee = users[0];

    if (assignee.role !== "team_member") {
      return res.status(400).json({
        error: "Cannot assign to this user",
        details: `${assignee.name} (${assignee.email}) is a ${assignee.role}, not a team member`,
      });
    }

    // 9. Update task with assignee
    await db.query(
      "UPDATE tasks SET assignee_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [assignee_id, taskId]
    );

    // 10. Get updated task with assignee info
    const [updatedTasks] = await db.query(
      `SELECT t.*, u.name as assignee_name, u.email as assignee_email
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = ?`,
      [taskId]
    );

    const updatedTask = updatedTasks[0];

    // 11. Return success response
    res.status(200).json({
      message: "Task assigned successfully",
      task: {
        id: updatedTask.id,
        title: updatedTask.title,
        status: updatedTask.status,
        assignee_id: updatedTask.assignee_id,
        assignee_name: updatedTask.assignee_name,
        project_id: updatedTask.project_id,
      },
      notification: "The team member will see this task in their dashboard",
    });
  } catch (error) {
    console.error("Assign task error:", error);
    res.status(500).json({ error: "Failed to assign task" });
  }
};

// Get tasks assigned to current team member
export const getMyTasks = async (req, res) => {
  try {
    // 1. Check user is Team Member
    if (req.user.role !== "team_member") {
      return res.status(403).json({
        error: "Only Team Members can view assigned tasks",
      });
    }

    // 2. Query tasks assigned to current user
    const [tasks] = await db.query(
      `SELECT 
        t.id,
        t.title,
        t.status,
        p.title as project_title
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE t.assignee_id = ?
       ORDER BY t.updated_at DESC`,
      [req.user.id]
    );

    // 3. Return response
    res.status(200).json({
      tasks: tasks,
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({ error: "Failed to fetch your tasks" });
  }
};
