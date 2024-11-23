import mongoose from "mongoose";
import { MODEL_NAMES } from "../utils/constant.util.js";

// Define the category schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for category
categorySchema.index({ name: 1 });

export const CategoryModel = mongoose.model(
  MODEL_NAMES.CATEGORY,
  categorySchema
);
