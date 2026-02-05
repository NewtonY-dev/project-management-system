import { OAuth2Client } from "google-auth-library";
import db from "../config/db.js";
import { generateToken } from "../utils/jwtUtils.js";

const DEFAULT_ROLE = "team_member";
const PROVIDER = "google";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

export const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const userPayload = await verifyGoogleIdToken(token);
    const user = await findOrCreateUser(userPayload);
    const jwtToken = generateToken(user.id, user.email, user.role);

    res.status(200).json({ 
      message: "Google login successful", 
      token: jwtToken, 
      user 
    });
    
  } catch (error) {
    res.status(400).json({ error: 'Invalid Google token' });
  }
};

const verifyGoogleIdToken = async (token) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload;
};

const findOrCreateUser = async (payload) => {
  const [existingUsers] = await db.query(
    "SELECT * FROM users WHERE email = ?", 
    [payload.email]
  );

  if (existingUsers.length === 0) {
    return await createNewUser(payload);
  }
  
  return await updateExistingUser(existingUsers[0], payload);
};

const createNewUser = async (payload) => {
  const [result] = await db.query(
    "INSERT INTO users (email, name, profile_picture, role, provider) VALUES (?, ?, ?, ?, ?)",
    [payload.email, payload.name, payload.picture, DEFAULT_ROLE, PROVIDER]
  );

  const newUser = {
    id: result.insertId,
    email: payload.email,
    name: payload.name,
    profile_picture: payload.picture,
    role: DEFAULT_ROLE,
    provider: PROVIDER,
  };
  
  return newUser;
};

const updateExistingUser = async (user, payload) => {
  if (payload.picture && payload.picture !== user.profile_picture) {
    await db.query(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [payload.picture, user.id]
    );
    user.profile_picture = payload.picture;
  }
  
  return user;
};

export const googleAuth = (req, res) => {
  const authUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "select_account",
  });
  
  res.redirect(authUrl);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user = await findOrCreateUser(payload);
    const jwtToken = generateToken(user.id, user.email, user.role);

    const frontendUrl = process.env.CORS_ORIGIN?.split(",")[0] || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/auth/callback?token=${jwtToken}`;
    
    res.redirect(redirectUrl);
    
  } catch (error) {
    res.redirect("http://localhost:5173/login?error=auth_failed");
  }
};
