import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const boardSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, minlength: 3 },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
    trashCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    trashLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
    trash: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

export default Board;
