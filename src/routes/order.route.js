import {
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  confirmOrderBodyValidation,
  createOrderBodyValidation,
  updateOrderStatusBodyValidation,
} from "../validations/order.validation.js";

export const orderRoutes = async (fastify, options) => {
  //To validate token
  fastify.addHook("preHandler", verifyToken);

  //All order routes
  fastify.post(
    "/",
    {
      schema: {
        body: createOrderBodyValidation,
      },
    },
    createOrder
  );
  fastify.patch(
    "/:orderId/confirm",
    {
      schema: {
        body: confirmOrderBodyValidation,
      },
    },
    confirmOrder
  );
  fastify.patch(
    "/:orderId/status",
    {
      schema: {
        body: updateOrderStatusBodyValidation,
      },
    },
    updateOrderStatus
  );
  fastify.get("/", getOrders);
  fastify.get("/:orderId", getOrderById);
};
