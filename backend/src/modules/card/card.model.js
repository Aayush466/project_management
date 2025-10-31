import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cardSchema = new mongoose.Schema(
  {
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    title: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, trim: true },
    color: {
      type: String,
      enum: ["green", "blue", "purple", "red", "yellow", "teal", "sky", "gray"],
      default: "green",
    },
    status: {
      type: String,
      enum: ["none","completed","pending"],
      default: "none",
    },
    priority: {
      type: String,
      enum: ["none","high","normal","low"],
      default: "none",
    },
    attachments:[{
      fileName: String,
      fileUrl: String,
      fileType: String,
      fileId: String
    }],
    dueDateTime: { type: Date },
    checkLists: [String]  
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
