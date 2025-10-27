import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect()
        console.log("mongoDB is connected to Database");

    } catch (error) {
        console.log("MongoDb connection error ", error);
        process.exit(1)

    }
}