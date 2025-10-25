import mongoose, { Schema } from "mongoose"

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, "Task title is required"]
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        tasks: [taskSchema],
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Admin who created the project
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }, { timestamps: true }
)

const Project = mongoose.model("Project", projectSchema);
export default Project;