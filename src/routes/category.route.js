import {
  getAllCategories,
  getProductsByCategoryId,
} from "../controllers/category.controller.js";

export const categoryRoutes = async (fastify, options) => {
  fastify.get("/", getAllCategories);

  fastify.get("/:categoryId/products", getProductsByCategoryId);
};
