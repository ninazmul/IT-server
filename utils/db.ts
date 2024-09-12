import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl: string = process.env.DATABASE_URL || "";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl);
    console.log(`Database connected with host: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
