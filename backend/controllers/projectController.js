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
      [req.user.id, cleanTitle]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "You already have a project with this title",
      });
    }

    // 4. Insert project into database
    const [result] = await db.query(
      "INSERT INTO projects (title, description, owner_id) VALUES (?, ?, ?)",
      [cleanTitle, cleanDescription, req.user.id]
    );

    // 5. Get and return the created project
    const [projects] = await db.query(
      "SELECT id, title, description, owner_id, created_at FROM projects WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(projects[0]);
  } catch (error) {
    ``;
    console.error("Project creation error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};
