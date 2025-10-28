import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyAccessToken = asyncHandler(async (req, _, next) => {
  try {
    // Get token from cookie OR Authorization header
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Access token missing");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by ID from token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized request: Invalid token");
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    // Catch JWT errors like token expired or invalid
    throw new ApiError(
      401,
      error?.message === "jwt expired"
        ? "Access token expired"
        : error?.message || "Invalid access token"
    );
  }
});

export const verifyRefreshToken = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.refreshToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-userpassword"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token, please login again");
  }
});