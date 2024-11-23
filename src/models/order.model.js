import mongoose from "mongoose";
import { MODEL_NAMES, ORDER_STATUS } from "../utils/constant.util.js";
import { CounterModel } from "./counter.model.js";

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.CUSTOMER,
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.DELIVERY_PARTNER,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.BRANCH,
      required: true,
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: MODEL_NAMES.PRODUCT,
          required: true,
        },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: MODEL_NAMES.PRODUCT,
          required: true,
        },
        count: { type: Number, required: true },
      },
    ],
    deliveryLocation: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      address: { type: String },
    },
    pickupLocation: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      address: { type: String },
    },
    deliveryPersonLocation: {
      longitude: { type: Number },
      latitude: { type: Number },
      address: { type: String },
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.AVAILABLE,
    },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Indexing for order
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ totalPrice: 1 });

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await CounterModel.findOneAndUpdate(
    {
      name: sequenceName,
    },
    {
      $inc: {
        sequenceValue: 1,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return sequenceDocument.sequenceValue;
};

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const sequenceValue = await getNextSequenceValue("orderId");
    this.orderId = `ORDR${sequenceValue.toString().padStart(5, "0")}`;
  }
  next();
});

export const OrderModel = mongoose.model(MODEL_NAMES.ORDER, orderSchema);
