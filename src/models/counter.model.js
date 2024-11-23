import mongoose from "mongoose";
import { MODEL_NAMES } from "../utils/constant.util.js";

// Define the counter schema
const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sequenceValue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for counter
counterSchema.index({ name: 1 });

export const CounterModel = mongoose.model(MODEL_NAMES.COUNTER, counterSchema);
