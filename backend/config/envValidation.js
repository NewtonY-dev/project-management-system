import dotenv from "dotenv";

dotenv.config();

// Required environment variables
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
  "CORS_ORIGIN",
];

// Validate required environment variables
const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    if (process.env.NODE_ENV !== "test") {
      console.error("❌ Missing required environment variables:");
      missing.forEach((key) => console.error(`   - ${key}`));
      console.error(
        "\nPlease check your .env file and ensure all required variables are set.",
      );
      console.error("Copy .env.example to .env and fill in the values.");
    }
    process.exit(1);
  }

  // Validate optional variables with defaults
  const config = {
    PORT: process.env.PORT || 8080,
    DB_PORT: process.env.DB_PORT || 3306,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.log("✅ Environment variables validated successfully");
  }
  return config;
};

export { validateEnv };
