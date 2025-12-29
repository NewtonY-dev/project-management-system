import db from "../config/db.js";

// Get team members for PM assignment dropdown
export const getUsers = async (req, res) => {
  try {
    // 1. Check user is Project Manager
    if (req.user.role !== "project_manager") {
      return res.status(403).json({
        error: "Only Project Managers can view team members",
      });
    }

    // 2. Get only team members from database
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE role = 'team_member'"
    );

    // 3. Return team members for assignment dropdown
    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ error: "Failed to retrieve team members" });
  }
};
