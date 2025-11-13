import * as userService from "./user.service.js";
import User from "./user.model.js";
import environmentVariables from "../../config/env.js";
import {
  sendMail,
  approvedUserEmail,
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
    const allUsers = await User.find({ email: { $ne: environmentVariables.adminEmail },access:false,verified:true }).select('-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode')

    const trashBoards = user.trashBoards.map(board=>({title:board.title,boardId:board._id}))

    if(req.user.email==environmentVariables.adminEmail)
      return res.json({ success: true, data:user,pendingUsers:allUsers,admin:true});

    res.json({ success: true, data:user,admin:false});
    
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
      access:environmentVariables.adminEmail==req.body.email?true:false
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

    if(req.user.email!=environmentVariables.adminEmail)
    {
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

    if(user.access)
       return res
        .status(400)
        .json({ message: "User already approved, can't approve again" });

    user.access=true;
    await user.save();

    approvedUserEmail(req.user.email, user.email);

    res
      .status(201)
      .json({
        success: true,
        message: `Approved successfully`,
        data: user.email,
      });
  } catch (err) {
    next(err);
  }
};