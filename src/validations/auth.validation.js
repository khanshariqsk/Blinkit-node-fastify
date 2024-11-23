export const deliveryPartnerLoginBodyValidation = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      errorMessage: "Email must be a valid email address.",
    },
    password: {
      type: "string",
      minLength: 6,
      errorMessage: "Password must be at least 6 characters long.",
    },
  },
  errorMessage: {
    required: {
      email: "Email is required.",
      password: "Password is required.",
    },
  },
};

export const customerLoginBodyValidation = {
  type: "object",
  required: ["phone"],
  properties: {
    phone: {
      type: "string",
      pattern: "^[0-9]{10}$",
      minLength: 10,
      maxLength: 10,
      errorMessage: "Phone number must be a valid 10-digit number.",
    },
  },
  errorMessage: {
    required: {
      phone: "Phone number is required.",
    },
  },
};

export const refreshTokenBodyValidation = {
  type: "object",
  required: ["refreshToken"],
  properties: {
    refreshToken: {
      type: "string",
      errorMessage: "Refresh token must be a valid string.",
    },
  },
  errorMessage: {
    required: {
      refreshToken: "Refresh token is required.",
    },
  },
};
