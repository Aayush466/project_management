import * as userService from "./user.service.js";
import User from "./user.model.js";
import environmentVariables from "../../config/env.js";
import { sendMail, sendInviteEmail, sendAcceptEmail, sendRejectEmail } from "../../utils/sendEmail.js";

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
    res.json({ success: true, data: user });
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
    };

    if (req.body.email != "shahayush688@gmail.com") {
      return res.status(400).json({ message: "email does not seems to be an admin email" });
    }

    sendMail(req.body.email, otp, environmentVariables.registrationOtpExpiry);

    const newUser = await userService.createUser(reqBody);
    res
      .status(201)
      .json({ success: true, message: "OTP sent successfully", data: newUser });
  } catch (err) {
    next(err);
  }
};

export const sendInvite = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email, verified: true }).select('-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode');

    if (!user) {
      return res.status(400).json({ message: "User not Exists, can't send Invite" });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: "Cannot send invite to yourself" });
    }

    if (req.user.invitedUsers.some(u => u.user.equals(user._id))) {
      return res.status(400).json({ message: "Invite already sent to this user" });
    }

    if (req.user.rejectedUsers.some(u => u.user.equals(user._id))) {
      return res.status(400).json({ message: "User already rejected invitation, can't sent again" });
    }

    if (req.user.myUsers.some(u => u.user.equals(user._id))) {
      return res.status(400).json({ message: "user already accepted invitation, can't sent again" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { invitedUsers: { user: user._id } }
    });

    user.invitations.push({ admin: req.user._id });
    await user.save();

    sendInviteEmail(user.email, user.name, req.user.email);

    res
      .status(201)
      .json({ success: true, message: `Invite sent successfully`, data: user });
  } catch (err) {
    next(err);
  }
};

export const acceptInvite = async (req, res, next) => {
  try {
    const admin = await User.findOne({ email: req.body.email, verified: true }).select('-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode');

    if (!admin) {
      return res.status(400).json({ message: "Admin not Exists, can't accept Invite" });
    }

    if (!req.user.invitations.some(u => u.admin.equals(admin._id))) {
      return res.status(400).json({ message: "Invitation not exists" });
    }

    const user = await User.findOne(req.user._id).select('-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode');

    user.invitations.pull({ admin: admin._id });
    user.acceptedAdmins.push({ admin: admin._id });
    await user.save();

    admin.invitedUsers.pull({ user: req.user._id });
    admin.myUsers.push({ user: req.user._id });
    await admin.save();

    sendAcceptEmail(admin.email, admin.name, req.user.name);

    res
      .status(201)
      .json({ success: true, message: `Invite accept successfully`, data: admin });
  } catch (err) {
    next(err);
  }
};

export const rejectInvite = async (req, res, next) => {
  try {
    const admin = await User.findOne({ email: req.body.email, verified: true }).select('-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode');

    if (!admin) {
      return res.status(400).json({ message: "Admin not Exists, can't accept Invite" });
    }

    if (!req.user.invitations.some(u => u.admin.equals(admin._id))) {
      return res.status(400).json({ message: "Invitation not exists" });
    }

    const user = await User.findOne(req.user._id).select('-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode');

    user.invitations.pull({ admin: admin._id });
    user.rejectedAdmins.push({ admin: admin._id });
    await user.save();

    admin.invitedUsers.pull({ user: req.user._id });
    admin.rejectedUsers.push({ user: req.user._id });
    await admin.save();

    sendRejectEmail(admin.email, admin.name, req.user.name);

    res
      .status(201)
      .json({ success: true, message: `Invite rejected successfully`, data: admin });
  } catch (err) {
    next(err);
  }
};

// export const deleteMember = async(req, res , next ) =>{
//    try {
//     const { memberId } = req.params; // Assume the member ID is sent as a URL parameter

//     if (!memberId) {
//       return res.status(400).json({ message: "Member ID is required" });
//     }

//     // Check if the member exists
//     const member = await Member.findById(memberId);
//     if (!member) {
//       return res.status(404).json({ message: "Member not found" });
//     }

//     // Delete the member from the database
//     await Member.findByIdAndDelete(memberId);

//     // Optionally, if you want to handle relationships (like deleting the member from other documents or updating lists):
//     // For example, if the member is part of a team or group:
//     // const team = await Team.findOne({ members: memberId });
//     // if (team) {
//     //   await Team.updateOne({ _id: team._id }, { $pull: { members: memberId } });
//     // }

//     return res.status(200).json({ message: "Member deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting member:", error);
//     next(error); // Call the next middleware (error handler)
//   }

// }