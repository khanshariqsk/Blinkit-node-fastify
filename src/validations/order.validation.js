import {
  MONGO_ID_ERROR_MESSAGE,
  MONGO_ID_PATTERN,
  ORDER_STATUS,
} from "../utils/constant.util.js";

export const createOrderBodyValidation = {
  type: "object",
  required: ["items", "branchId", "totalPrice"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "item", "count"],
        properties: {
          id: {
            type: "string",
            pattern: MONGO_ID_PATTERN,
            errorMessage: `Item ID ${MONGO_ID_ERROR_MESSAGE}`,
          },
          item: {
            type: "string",
            pattern: MONGO_ID_PATTERN,
            errorMessage: `Item field ${MONGO_ID_ERROR_MESSAGE}`,
          },
          count: {
            type: "integer",
            minimum: 1,
            errorMessage:
              "Count must be a positive integer greater than or equal to 1.",
          },
        },
      },
    },
    branchId: {
      type: "string",
      pattern: MONGO_ID_PATTERN,
      errorMessage: `Branch ID ${MONGO_ID_ERROR_MESSAGE}`,
    },
    totalPrice: {
      type: "number",
      minimum: 0,
      errorMessage: "Total price must be a non-negative number.",
    },
  },
  errorMessage: {
    required: {
      items: "Items array is required.",
      branchId: "Branch ID is required.",
      totalPrice: "Total price is required.",
    },
    properties: {
      items: "Items must be an array of objects.",
    },
  },
};

export const confirmOrderBodyValidation = {
  type: "object",
  required: ["deliveryPersonLocation"],
  properties: {
    deliveryPersonLocation: {
      type: "object",
      required: ["longitude", "latitude", "address"],
      properties: {
        longitude: {
          type: "number",
          minimum: -180,
          maximum: 180,
          errorMessage:
            "Longitude must be a valid number between -180 and 180.",
        },
        latitude: {
          type: "number",
          minimum: -90,
          maximum: 90,
          errorMessage: "Latitude must be a valid number between -90 and 90.",
        },
        address: {
          type: "string",
          minLength: 5,
          errorMessage: "Address must be a string with at least 5 characters.",
        },
      },
      errorMessage: {
        required: {
          longitude: "Longitude is required.",
          latitude: "Latitude is required.",
          address: "Address is required.",
        },
      },
    },
  },
  errorMessage: {
    required: {
      deliveryPersonLocation: "Delivery person location is required.",
    },
  },
};

export const updateOrderStatusBodyValidation = {
  type: "object",
  required: ["deliveryPersonLocation", "status"],
  properties: {
    deliveryPersonLocation: {
      type: "object",
      required: ["longitude", "latitude", "address"],
      properties: {
        longitude: {
          type: "number",
          minimum: -180,
          maximum: 180,
          errorMessage:
            "Longitude must be a valid number between -180 and 180.",
        },
        latitude: {
          type: "number",
          minimum: -90,
          maximum: 90,
          errorMessage: "Latitude must be a valid number between -90 and 90.",
        },
        address: {
          type: "string",
          minLength: 5,
          errorMessage: "Address must be a string with at least 5 characters.",
        },
      },
      errorMessage: {
        required: {
          longitude: "Longitude is required.",
          latitude: "Latitude is required.",
          address: "Address is required.",
        },
      },
    },
    status: {
      type: "string",
      enum: Object.values(ORDER_STATUS),
      errorMessage: `Status must be one of the following: ${Object.values(
        ORDER_STATUS
      ).join(", ")}.`,
    },
  },
  errorMessage: {
    required: {
      deliveryPersonLocation: "Delivery person location is required.",
      status: "Status is required.",
    },
  },
};
