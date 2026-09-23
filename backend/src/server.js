import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration:
// - In production, set CLIENT_URL to the origin(s) allowed to call this API
//   (comma-separated, e.g. "https://devboard-two-flax.vercel.app").
// - When CLIENT_URL is not set (local development), fall back to allowing all origins.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

if (allowedOrigins.length > 0) {
  app.use(
    cors({
      origin(origin, callback) {
        // Allow requests with no Origin header (curl, health checks, mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
    }),
  );
} else {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check so you can quickly verify the API is running.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/projects/", projectRoutes);
app.use("/api/v1/tasks/", taskRoutes);

// JSON 404 for unknown routes (instead of Express' default HTML error page)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Central error handler (e.g. malformed JSON bodies)
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : "Something went wrong",
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
