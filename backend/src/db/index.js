import mongoose from "mongoose";

export const connectDB =async ()=>{
    try {
        const instanceConnection = await mongoose.connect(process.env.MONGO_DB)
        console.log("mongoDB is connected to Database", instanceConnection);
        
    } catch (error) {
        console.log("MongoDb connection error ", error);
        process.exit(1)
        
    }
}