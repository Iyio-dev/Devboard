import mongoose from "mongoose";

export async function connectDB() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Connection failed", error);
        throw error;
    }
}