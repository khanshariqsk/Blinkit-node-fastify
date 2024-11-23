import {
  customerLogin,
  deliveryPartnerLogin,
  fetchUser,
  refreshToken,
  updateUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  customerLoginBodyValidation,
  deliveryPartnerLoginBodyValidation,
  refreshTokenBodyValidation,
} from "../validations/auth.validation.js";

export const authRoutes = async (fastify, options) => {
  //All auth non protected routes
  fastify.post(
    "/customer/login",
    {
      schema: {
        body: customerLoginBodyValidation,
      },
    },
    customerLogin
  );
  fastify.post(
    "/delivery-partner/login",
    {
      schema: {
        body: deliveryPartnerLoginBodyValidation,
      },
    },
    deliveryPartnerLogin
  );
  fastify.post(
    "/refresh-token",
    {
      schema: {
        body: refreshTokenBodyValidation,
      },
    },
    refreshToken
  );

  //All auth protected routes
  fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
  fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
};
