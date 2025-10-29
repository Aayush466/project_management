import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    myUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        acceptedAt: { type: Date, default: Date.now },
      },
    ],
    myProjects: [
      { type: mongoose.Schema.Types.ObjectId},
    ],
    invitedUsers: [{user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },invitedAt:{ type: Date, default: Date.now }}],
    invitations: [{admin:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },invitedAt:{ type: Date, default: Date.now }}],
    rejectedUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rejectedAt: { type: Date, default: Date.now },
      },
    ],
    rejectedAdmins: [
      {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date, default: Date.now },
  },
    ], acceptedAdmins: [
      {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date, default: Date.now },
  },
    ],
    hashedCode: { type: String, default: "" },
    expiresOtpAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    reset: {
      hashedCode: {
        type: String,
        default: "", // Or set to null if preferred
      },
      expiresOtpAt: {
        type: Date,
        default: "",
      },
      expiresResetAt: {
        type: Date,
        default: "",
      },
    },
    refreshToken: { type: String }, // Array to store refresh tokens
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("hashedCode")) return next();
  if (this.hashedCode === "") {
    this.hashedCode = "";
    return next();
  }
  const salt = await bcrypt.genSalt(5);
  this.hashedCode = await bcrypt.hash(this.hashedCode, salt);
  next();
});

userSchema.methods.matchOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.hashedCode);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("reset.hashedCode")) return next();

  if (this.reset.hashedCode === "") {
    this.reset.hashedCode = "";
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.reset.hashedCode = await bcrypt.hash(this.reset.hashedCode, salt);
  next();
});

userSchema.methods.matchResetOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.reset.hashedCode);
};

const User = mongoose.model("User", userSchema);

export default User;
