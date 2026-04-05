import mongoose from "mongoose";
import { ENV } from "../../config/env";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(ENV.MONGO_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("Connection Failed !!");
    console.log(error);
    process.exit(1);
  }
};
