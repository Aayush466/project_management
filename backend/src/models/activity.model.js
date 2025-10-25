import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: [true, "Activity action is required"], // e.g., "Task created", "User assigned"
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: false,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project.tasks", // reference to a task inside project
            required: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // User who performed the action
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Optional: if activity involves assigning task to someone
        },
        type: {
            type: String,
            enum: ["task", "project", "invite", "other"],
            default: "other",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        details: {
            type: String,
            default: "", // Optional extra information
        },
    },
    { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);