import { CategoryModel } from "../models/category.model.js";

export const getACategoryByQuery = async (query = {}) => {
  const category = await CategoryModel.findOne(query);
  return category;
};

export const getCategoriesByQuery = async (query = {}) => {
  const categories = await CategoryModel.find(query);
  return categories;
};
