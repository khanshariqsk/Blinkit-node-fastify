import { getCategoriesByQuery } from "../services/category.service.js";
import { getProductsByQuery } from "../services/product.service.js";

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await getCategoriesByQuery();

    return reply.send({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const getProductsByCategoryId = async (req, reply) => {
  try {
    const { categoryId } = req.params;
    const products = await getProductsByQuery({ category: categoryId });

    return reply.send({
      message: "Products by category fetched successfully",
      products,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};
