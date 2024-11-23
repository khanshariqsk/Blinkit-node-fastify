import { ProductModel } from "../models/product.model.js";

export const getAProductByQuery = async (query = {}) => {
  const product = await ProductModel.findOne(query);
  return product;
};

export const getProductsByQuery = async (query = {}) => {
  const products = await ProductModel.find(query);
  return products;
};
