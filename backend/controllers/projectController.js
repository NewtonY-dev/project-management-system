import db from "../config/db.js";

// Validation helper function
const validateProjectInput = (title, description) => {
  const errors = {};

  // Check title exists and is valid
  if (!title || title.trim() === "") {
    errors.title = "Project title is required";
  } else if (title.length > 255) {
    errors.title = "Title cannot exceed 255 characters";
  }

  // Check description format if provided
  if (description && typeof description !== "string") {
    errors.description = "Description must be text";
  }

  return errors;
};

// Main create project function
export const createProject = async (req, res) => {
  try {
    // 1. Check if user is a Project Manager
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can create projects",
      });
    }

    // 2. Get and validate input data
    const { title, description } = req.body;
    const validationErrors = validateProjectInput(title, description);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const cleanTitle = title.trim();
    const cleanDescription = description ? description.trim() : null;

    // 3. Check for duplicate title for this PM
    const [existing] = await db.query(
      "SELECT id FROM projects WHERE owner_id = ? AND title = ?",
      [req.user.id, cleanTitle],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "You already have a project with this title",
      });
    }

    // 4. Insert project into database
    const [result] = await db.query(
      "INSERT INTO projects (title, description, owner_id) VALUES (?, ?, ?)",
      [cleanTitle, cleanDescription, req.user.id],
    );

    // 5. Get and return the created project
    const [projects] = await db.query(
      "SELECT id, title, description, owner_id, created_at FROM projects WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json(projects[0]);
  } catch (error) {
    ``;
    console.error("Project creation error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// Get all projects for the current PM
export const getProjects = async (req, res) => {
  try {
    // 1. Check if user is a Project Manager
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can view projects",
      });
    }

    // 2. Get projects from database
    const [projects] = await db.query(
      `SELECT 
        p.id, 
        p.title,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'todo') as todo_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'in_progress') as in_progress_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as done_count
       FROM projects p
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id],
    );

    // 3. Format the response
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      task_summary: {
        todo: project.todo_count,
        in_progress: project.in_progress_count,
        done: project.done_count,
      },
    }));

    // 4. Return the projects
    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
};

// Get a specific project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a Project Manager
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can view projects",
      });
    }

    // Get project from database
    const [projects] = await db.query(
      `SELECT 
        p.id, 
        p.title, 
        p.description,
        p.created_at,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'todo') as todo_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'in_progress') as in_progress_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as done_count
       FROM projects p
       WHERE p.id = ? AND p.owner_id = ?`,
      [id, req.user.id],
    );

    if (projects.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = projects[0];
    const formattedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      created_at: project.created_at,
      task_summary: {
        todo: project.todo_count,
        in_progress: project.in_progress_count,
        done: project.done_count,
      },
    };

    res.status(200).json(formattedProject);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Failed to retrieve project" });
  }
};

// Get all tasks for a specific project
export const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a Project Manager
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can view project tasks",
      });
    }

    // Get tasks for this project with integrated ownership verification
    const [tasks] = await db.query(
      `SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.status, 
        t.created_at,
        t.updated_at,
        u.id as assignee_id,
        u.name as assignee_name
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.project_id = ? AND EXISTS (
         SELECT 1 FROM projects p 
         WHERE p.id = ? AND p.owner_id = ?
       )
       ORDER BY t.created_at DESC`,
      [id, id, req.user.id],
    );

    // Verify project exists by checking if we got any results or if the project exists
    const [projectCheck] = await db.query(
      "SELECT id FROM projects WHERE id = ? AND owner_id = ?",
      [id, req.user.id]
    );

    if (projectCheck.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignee: task.assignee_id ? {
        id: task.assignee_id,
        name: task.assignee_name
      } : null,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Get project tasks error:", error);
    res.status(500).json({ error: "Failed to retrieve project tasks" });
  }
};
