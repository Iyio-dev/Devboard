import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    }
  },
  {
    timestamps: true,
  },
);

// Every list query filters by user and sorts by createdAt desc — a compound
// index matching that shape serves both parts of the query directly.
projectSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema)