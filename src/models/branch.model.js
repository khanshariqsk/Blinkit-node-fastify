import mongoose from "mongoose";
import { MODEL_NAMES } from "../utils/constant.util.js";

// Define the branch schema
const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    address: { type: String },
    deliveryPartners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODEL_NAMES.DELIVERY_PARTNER,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing for branch
branchSchema.index({ name: 1 });
branchSchema.index({ "location.longitude": 1, "location.latitude": 1 });
branchSchema.index({ deliveryPartners: 1 });

export const BranchModel = mongoose.model(MODEL_NAMES.BRANCH, branchSchema);
