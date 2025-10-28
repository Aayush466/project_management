import mongoose from 'mongoose';
import environmentVariables from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(environmentVariables.mongoURI || "mongodb://127.0.0.1:27017/mydb");
    console.log('Database connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
};

export default connectDB;
