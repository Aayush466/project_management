import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ayush123:ayush123@cluster0.6ayflkm.mongodb.net/video?retryWrites=true&w=majority&appName=Cluster0")
        console.log("mongoDB is connected to Database");

    } catch (error) {
        console.log("MongoDb connection error ", error);
        process.exit(1)

    }
}