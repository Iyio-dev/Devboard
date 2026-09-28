import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  },
);

// Covers both "all my tasks" and "my tasks for this project", sorted by
// creation date, without a collection scan.
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, project: 1, createdAt: -1 });

export default mongoose.models.Task || mongoose.model('Task', taskSchema)