import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next({
            status: 401,
            message: "Not authorized, token missing",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id).select("-password");

        if (!user) {
            return next({
                status: 401,
                message: "User not found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);

        return next({
            status: 401,
            message: "Token invalid or expired",
        });
    }
}