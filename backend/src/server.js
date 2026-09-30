import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/projects/", projectRoutes);
app.use("/api/v1/tasks/", taskRoutes);
app.use("/api/v1/activities/", activityRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DevBoard API is running",
    });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware)

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
