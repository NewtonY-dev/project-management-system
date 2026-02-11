import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { initDatabase } from "./config/db.js";
import { validateEnv } from "./config/envValidation.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import { ensureUploadsDirectory } from "./utils/fileUtils.js";
import { logInfo } from "./utils/logger.js";

dotenv.config();
const config = validateEnv();

const app = express();

// Ensure uploads directory exists on server startup
ensureUploadsDirectory();

// Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins =
      process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || [];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      process.env.NODE_ENV === "development" ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    // In production, only allow configured origins
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (process.env.CORS_ORIGIN?.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
});
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = config.PORT;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Project Management System API is running!");
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Server is running on http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
