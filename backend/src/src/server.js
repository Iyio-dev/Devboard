import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import cors from 'cors'
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

app.use('/api/v1/auth/', authRoutes)
app.use('/api/v1/projects/', projectRoutes)
app.use("/api/v1/tasks/", taskRoutes)

connectDB().then(
  app.listen(PORT, () => {
    console.log("server running sucessfully");
  })
)
