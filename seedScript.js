import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { ProductModel } from "./src/models/product.model.js";
import { CategoryModel } from "./src/models/category.model.js";
import { categories, products } from "./seedData.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});

    const categoriesData = await CategoryModel.insertMany(categories);

    const categoryMap = categoriesData.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    const productsWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    await ProductModel.insertMany(productsWithCategoryIds);

    console.log("Database Seeded Sucessfully ✅");
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
