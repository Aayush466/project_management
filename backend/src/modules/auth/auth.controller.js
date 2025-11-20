import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import environmentVariables from "../../config/env.js";
import { approveUserEmail, sendResetOtpService } from "../../utils/sendEmail.js";

const generateOtpCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const isProd = environmentVariables.nodeEnv === "production";

// Generate tokens with minimal payload (only user.id)
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, environmentVariables.accessTokenSecret, {
    expiresIn: environmentVariables.accessTokenExpiry,
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, environmentVariables.refreshTokenSecret, {
    expiresIn: environmentVariables.refreshTokenExpiry,
  });

// Submit Controller
export const submitUserOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({
      email,
      verified: false,
      expiresOtpAt: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "expired OTP" });

    const isMatch = await user.matchOtp(otp.toString());
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // Save refresh token in DB
    user.verified = true;
    user.hashedCode = "";
    await user.save();

    if(user.email!=environmentVariables.adminEmail)
    {
      approveUserEmail(environmentVariables.adminEmail,user.email);
      return res.status(200).json({ message: "verified successful, wait until the admin approve" });
    }
    // Generate tokens containing only the user ID
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set both tokens in httpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth",
    });

    res.json({ message: "Verified successful" });
  } catch (error) {
    next(error);
  }
};

// Login Controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, verified: true });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens containing only the user ID
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    if(user.reject && user.email!=environmentVariables.adminEmail)
    {
      return res.status(400).json({ message: "Admin rejected you, can't login" });
    }

    if(!user.access && user.email!=environmentVariables.adminEmail)
    {
      return res.status(400).json({ message: "Admin not yet approved you, can't login" });
    }

    // Set both tokens in httpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth",
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

// Refresh Access Token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const payload = jwt.verify(token, environmentVariables.refreshTokenSecret);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken != token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(403).json({ message: "refresh token expired, please login" });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const payload = jwt.verify(token, environmentVariables.refreshTokenSecret);
    const user = await User.findById(payload.id);

    if (user) {
      user.refreshToken = "";
      await user.save();
    }
    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      path: "/api/auth",
    });

    res.json({ message: "Logout successful" });
  } catch {
    // Ignore any invalid token error
    res.status(403).json({ message: "refresh token expired" });
  }
};

// sendResetOtp Controller
export const sendResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email, verified: true });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOtpCode();
    sendResetOtpService(email, otp, environmentVariables.resetOtpExpiry);

    user.reset = {
      hashedCode: otp,
      expiresOtpAt: new Date(
        Date.now() + environmentVariables.resetOtpExpiry * 60 * 1000
      ),
    };
    user.save();

    res.json({ message: "please submit OTP to reset password" });
  } catch (error) {
    next(error);
  }
};

// sendResetOtp Controller
export const submitResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({
      email,
      verified: true,
      "reset.expiresOtpAt": { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "OTP expired" });

    const isMatch = await user.matchResetOtp(otp.toString());
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.reset.expiresResetAt = Date(
      Date.now() + environmentVariables.resetPasswordExpiry * 60 * 1000
    );
    user.save();

    res.json({ message: "otp submitted successfully" });
  } catch (error) {
    next(error);
  }
};

// sendResetOtp Controller
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      email,
      verified: true,
      "reset.expiresResetAt": { $gt: new Date() },
    });
    if (!user)
      return res.status(400).json({ message: "Time out, please resend OTP" });

    const isMatch = await user.matchResetOtp(otp.toString());
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.reset = { hashedCode: "", expiresOtpAt: "", expiresResetAt: "" };
    user.password = password;
    user.save();

    res.json({ message: "password reset successfully" });
  } catch (error) {
    next(error);
  }
};
