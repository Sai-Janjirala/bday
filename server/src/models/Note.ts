/**
 * Note Model — MongoDB schema for love notes / wishes
 */
import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  name?: string;
  message: string;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    name: {
      type: String,
      default: "Anonymous",
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INote>("Note", NoteSchema);
