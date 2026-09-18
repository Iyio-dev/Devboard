import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import Project from "../models/Project.js";

dotenv.config();

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT VERIFICATION FAILED", error);
    res.status(401).json({
      success: false,
      message: "Token Invalid or expired",
    });
  }
}

