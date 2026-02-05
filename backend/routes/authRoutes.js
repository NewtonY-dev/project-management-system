import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  googleAuth,
  googleCallback,
  verifyGoogleToken,
} from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Google OAuth routes
router.post("/google/token", verifyGoogleToken);
router.get("/google/callback", googleCallback);

export default router;
