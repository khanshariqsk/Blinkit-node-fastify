import mongoose from "mongoose";

// Function to connect to the database
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("DB Connected! ✅");
  } catch (error) {
    console.log("Database connection error: ", error);
  }
};

export { connectDB };
