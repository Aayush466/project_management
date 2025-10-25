import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        useremail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        avatar: {
            type: String,
            required: false
        },
        role: {
            type: String,
            enum: ['User', 'Admin'],
            default: 'user',
        },
        userpassword: {
            type: String,
            required: [true, "Password is required"],
        },
        otp: {
            type: Number,
            required: [true, "OTP is required"]
        },
        verified: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        inviteToken: {
            type: String,
            default: null, // used when sending invitation email
        },
        inviteExpires: {
            type: Date,
            default: null
        }
    }, { timestamps: true, }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("userpassword")) return next();

    this.userpassword = await bcrypt.hash(this.userpassword, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.userpassword);
};

userSchema.methods.isOtpCorrect = async function (otp) {
    return otp == this.otp;
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            useremail: this.useremail,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);