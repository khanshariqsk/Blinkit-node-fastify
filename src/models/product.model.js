import mongoose, { Mongoose } from "mongoose";
import { MODEL_NAMES } from "../utils/constant.util.js";

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    quantity: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.CATEGORY,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for product
productSchema.index({ name: 1 });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ discountPrice: 1 });

export const ProductModel = mongoose.model(MODEL_NAMES.PRODUCT, productSchema);
