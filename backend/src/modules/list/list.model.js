import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const listSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: { type: String, required: true, trim: true, minlength: 3 },
    color: {
      type: String,
      enum: ["green", "blue", "purple", "red", "yellow", "teal", "sky", "gray"],
      default: "green",
    },
    cards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card"
    }],
    isArchived:{type:Boolean,default:false}
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);

export default List;
