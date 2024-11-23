export const ROLES = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
  DELIVERY_PARTNER: "DeliveryPartner",
};

export const MODEL_NAMES = {
  BRANCH: "Branch",
  CUSTOMER: "Customer",
  ADMIN: "Admin",
  DELIVERY_PARTNER: "DeliveryPartner",
  CATEGORY: "Category",
  PRODUCT: "Product",
  COUNTER: "Counter",
  ORDER: "Order",
};

export const ORDER_STATUS = {
  AVAILABLE: "Available",
  CONFIRMED: "Confirmed",
  ARRIVING: "Arriving",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const MONGO_ID_ERROR_MESSAGE =
  "must be a valid MongoDB ObjectID (24-character hex string).";

export const MONGO_ID_PATTERN = "^[a-fA-F0-9]{24}$";
