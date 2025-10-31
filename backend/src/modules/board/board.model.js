import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const boardSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, minlength: 3 },
    lists: [ { type: mongoose.Schema.Types.ObjectId, ref: "List" }]
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

export default Board;
