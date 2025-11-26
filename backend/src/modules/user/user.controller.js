import * as userService from "./user.service.js";
import User from "./user.model.js";
import environmentVariables from "../../config/env.js";
import {
  sendMail,
  approvedUserEmail,
  rejectedUserEmail,
  userProfileUpdatedEmail,
} from "../../utils/sendEmail.js";

const generateOtpCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.user._id);
    const allUsers = await User.find({
      email: { $ne: environmentVariables.adminEmail },
      access: false,
      reject: false,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );
    const rejectedUsers = await User.find({
      email: { $ne: environmentVariables.adminEmail },
      access: false,
      reject: true,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );

     const acceptedUsers = await User.find({
      email: { $ne: environmentVariables.adminEmail },
      access: true,
      reject: false,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );

    if (req.user.email == environmentVariables.adminEmail)
      return res.json({
        success: true,
        data: user,
        pendingUsers: allUsers,
        rejectedUsers: rejectedUsers,
        acceptedUsers: acceptedUsers,
        admin: true,
      });

    res.json({ success: true, data: user, admin: false });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const otp = generateOtpCode();
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (user.verified)
        return res.status(400).json({ message: "Already Exists" });
      else await userService.deleteUser({ email: req.body.email });
    }
    const reqBody = {
      ...req.body,
      hashedCode: otp,
      expiresOtpAt: new Date(
        Date.now() + environmentVariables.registrationOtpExpiry * 60 * 1000
      ),
      access: environmentVariables.adminEmail == req.body.email ? true : false,
    };

    sendMail(req.body.email, otp, environmentVariables.registrationOtpExpiry);

    const newUser = await userService.createUser(reqBody);
    res
      .status(201)
      .json({ success: true, message: "OTP sent successfully", data: newUser });
  } catch (err) {
    next(err);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    if (req.user.email != environmentVariables.adminEmail) {
      return res
        .status(400)
        .json({ message: "You are not admin, can't approve" });
    }

    const user = await User.findOne({
      email: req.body.email,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not exists, can't approve" });
    }

    if (user.access)
      return res
        .status(400)
        .json({ message: "User already approved, can't approve again" });

    user.access = true;
    user.reject = false;
    await user.save();

    approvedUserEmail(req.user.email, user.email);

    res.status(201).json({
      success: true,
      message: `Approved successfully`,
      data: user.email,
    });
  } catch (err) {
    next(err);
  }
};

export const rejectUser = async (req, res, next) => {
  try {
    if (req.user.email != environmentVariables.adminEmail) {
      return res
        .status(400)
        .json({ message: "You are not admin, can't reject" });
    }

    const user = await User.findOne({
      email: req.body.email,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );

    if (!user) {
      return res.status(400).json({ message: "User not exists, can't reject" });
    }

    if (user.reject)
      return res
        .status(400)
        .json({ message: "User already rejected, can't reject again" });

    user.reject = true;
    user.access = false;
    await user.save();

    rejectedUserEmail(req.user.email, user.email);

    res.status(201).json({
      success: true,
      message: `Rejected successfully`,
      data: user.email,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    if (req.user.email != environmentVariables.adminEmail) {
      return res
        .status(400)
        .json({ message: "You are not admin, can't update yourself" });
    }

    const user = await User.findOne({
      email: req.user.email,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password;

    await user.save();

    res.status(201).json({
      success: true,
      message: `Profile updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.email != environmentVariables.adminEmail) {
      return res
        .status(400)
        .json({ message: "You are not admin, can't update user profile" });
    }

    const user = await User.findOne({
      email: req.body.email,
      verified: true,
    }).select(
      "-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode"
    );

    if (!user) {
      return res.status(400).json({ message: "User not exists, can't update profile" });
    }

    if (user.reject)
      return res
        .status(400)
        .json({ message: "User rejected, can't update profile" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password;

    userProfileUpdatedEmail(req.user.email, user.email,user.name);

    await user.save();

    res.status(201).json({
      success: true,
      message: `Profile updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
