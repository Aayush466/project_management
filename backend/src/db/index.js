import mongoose from "mongoose";

export const connectDB =async ()=>{
    try {
        await mongoose.connect("mongodb+srv://blog123:blog123@cluster0.noemrme.mongodb.net/?appName=Cluster0")
        console.log("mongoDB is connected to Database");
        
    } catch (error) {
        console.log("MongoDb connection error ", error);
        process.exit(1)
        
    }
}