import mongoose from "mongoose";

// Returns true when the given value is a valid MongoDB ObjectId.
// Used to return a clean 404 for bad IDs instead of a Mongoose CastError (500).
export default function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
