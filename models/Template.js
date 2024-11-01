//Template.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    access: { type: String, enum: ["public", "restricted"], default: "public" },
    imageUrl: { type: String, required: false }, // For cloud storage
    questions: [
      {
        type: { type: String, required: true }, // e.g., 'single-line', 'multi-line', etc.
        title: { type: String, required: true },
        description: { type: String, required: false },
        displayStatus: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);
export default Template;
