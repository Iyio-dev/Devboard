import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";

dotenv.config();

export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next({
            status: 400,
            message: "Missing fields required",
        });
    }

    if (password.length < 8) {
        return next({
            status: 400,
            message: "Password must be at least 8 characters",
        });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined on this server");
    }

    const exists = await User.findOne({ email }).lean();

    if (exists) {
        return next({
            status: 409,
            message: "Email has been used",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRES_IN,
        },
    );

    return res.status(201).json({
        success: true,
        message: "Account created successfully",
        token,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        },
    });
});

// Returns the currently authenticated user's basic profile.
// Used by the frontend to keep user info after a page refresh.

export const getMe = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id.toString(),
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt,
        },
    });
});

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next({
            status: 400,
            message: "Missing fields required",
        });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined on this server");
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next({
            status: 404,
            message: "No account found with this email",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next({
            status: 401,
            message: "Email or password incorrect",
        });
    }

    const token = jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRES_IN,
        },
    );

    return res.status(200).json({
        success: true,
        message: "Account login successfully",
        token,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        },
    });
});
