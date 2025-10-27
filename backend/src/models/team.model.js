import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
    {
        useremail: { type: String, required: true, unique: true },
        inviteToken: { type: String },
        inviteExpires: { type: Date },
        verified: { type: Boolean, default: false },
        invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    { timestamps: true }
);

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

