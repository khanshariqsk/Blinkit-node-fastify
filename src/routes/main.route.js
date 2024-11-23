import { authRoutes } from "./auth.route.js";
import { categoryRoutes } from "./category.route.js";
import { orderRoutes } from "./order.route.js";

export const v1Routes = async (fastify, options) => {
  //All v1 main routes
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(categoryRoutes, { prefix: "/categories" });
  fastify.register(orderRoutes, { prefix: "/orders" });
};
