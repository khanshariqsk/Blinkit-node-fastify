import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES, MODEL_NAMES } from "../utils/constant.util.js";

// Base user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(ROLES),
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: [ROLES.CUSTOMER],
    default: ROLES.CUSTOMER,
  },
  liveLocation: {
    longitude: { type: Number },
    latitude: { type: Number },
  },
  address: { type: String },
});

// Delivery Partner Schema
const deliveryPartnerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: [ROLES.DELIVERY_PARTNER],
      default: ROLES.DELIVERY_PARTNER,
    },
    liveLocation: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    address: { type: String },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.BRANCH,
    },
  },
  {
    timestamps: true,
  }
);

// Admin Schema
const adminSchema = new mongoose.Schema({
  ...userSchema.obj, 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [ROLES.ADMIN],
    default: ROLES.ADMIN,
  },
});

deliveryPartnerSchema.pre("save", async function (next) {
  // If the password is modified or it's a new document, hash the password
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

adminSchema.pre("save", async function (next) {
  // If the password is modified or it's a new document, hash the password
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Indexing for admin
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ isActivated: 1 });

// Indexing for customer
customerSchema.index({ phone: 1 });
customerSchema.index({ role: 1 });
customerSchema.index({ isActivated: 1 });

//Indexing for delivery partner
deliveryPartnerSchema.index({ email: 1 });
deliveryPartnerSchema.index({ phone: 1 });
deliveryPartnerSchema.index({ role: 1 });
deliveryPartnerSchema.index({ isActivated: 1 });
deliveryPartnerSchema.index({ branch: 1 });

export const CustomerModel = mongoose.model(
  MODEL_NAMES.CUSTOMER,
  customerSchema
);
export const DeliveryPartnerModel = mongoose.model(
  MODEL_NAMES.DELIVERY_PARTNER,
  deliveryPartnerSchema
);
export const AdminModel = mongoose.model(MODEL_NAMES.ADMIN, adminSchema);
