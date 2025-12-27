import bcrypt from "bcryptjs";
import db from "../config/db.js";
import { generateToken } from "../utils/jwtUtils.js";

const SALT_ROUNDS = 12;
const VALID_ROLES = ["project_manager", "team_member"];

// Basic email format check + normalization
const validateEmail = (raw) => {
  if (!raw) return { valid: false, value: null, error: "Email is required" };

  const email = String(raw).trim().toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email)) {
    return { valid: false, value: null, error: "Invalid email format" };
  }

  return { valid: true, value: email, error: null };
};

// Password rules: at least six characters
const validatePassword = (pwd) => {
  if (!pwd) return { valid: false, value: null, error: "Password is required" };

  const s = String(pwd);
  if (s.length < 6) {
    return {
      valid: false,
      value: null,
      error: "Password must be at least 6 characters long",
    };
  }

  return { valid: true, value: s, error: null };
};

// Name validation
const validateName = (name) => {
  if (!name) return { valid: false, value: null, error: "Name is required" };

  const s = String(name).trim();

  if (s.length < 1) {
    return { valid: false, value: null, error: "Name cannot be empty" };
  }

  if (s.length > 100) {
    return {
      valid: false,
      value: null,
      error: "Name cannot exceed 100 characters",
    };
  }

  return { valid: true, value: s, error: null };
};

// Role validation
const validateRole = (role) => {
  if (!role) return { valid: false, value: null, error: "Role is required" };

  const roleStr = String(role);

  if (!VALID_ROLES.includes(roleStr)) {
    return {
      valid: false,
      value: null,
      error: `Role must be either "project_manager" or "team_member"`,
    };
  }

  return { valid: true, value: roleStr, error: null };
};

export const register = async (req, res) => {
  try {
    // Validate all inputs with specific error messages
    const emailValidation = validateEmail(req.body.email);
    const nameValidation = validateName(req.body.name);
    const passwordValidation = validatePassword(req.body.password);
    const roleValidation = validateRole(req.body.role);

    // Collect all errors
    const errors = {};

    if (!emailValidation.valid) errors.email = emailValidation.error;
    if (!nameValidation.valid) errors.name = nameValidation.error;
    if (!passwordValidation.valid) errors.password = passwordValidation.error;
    if (!roleValidation.valid) errors.role = roleValidation.error;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    // All inputs are valid - use the normalized values
    const email = emailValidation.value;
    const name = nameValidation.value;
    const password = passwordValidation.value;
    const role = roleValidation.value;

    // Check for existing user
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return res.status(409).json({
        message: "Registration failed",
        error: "Email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, role]
    );

    // Generate JWT token
    const token = generateToken(result.insertId, email, role);

    // Return safe user data (no password)
    const user = {
      id: result.insertId,
      email,
      name,
      role,
    };

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    // Validate inputs
    const emailValidation = validateEmail(req.body.email);
    const passwordValidation = validatePassword(req.body.password);

    // Collect errors
    const errors = {};
    if (!emailValidation.valid) errors.email = emailValidation.error;
    if (!passwordValidation.valid) errors.password = passwordValidation.error;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
    }

    const email = emailValidation.value;
    const password = passwordValidation.value;

    // Fetch user
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Exclude password from response
    const { password_hash: _, ...userData } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};
