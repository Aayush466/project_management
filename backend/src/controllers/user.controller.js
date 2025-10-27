import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
        user: process.env.USER,
        pass: process.env.USERPASS
    },
});

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            `Something went wrong while generating referesh and access token :`
        );
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { useremail, username, role, userpassword } = req.body;

    if (
        [useremail, username, userpassword, role].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ useremail });

    if (role && (role === 'Admin' || role === 'User')) {
        // Do not throw an error.
    } else {
        throw new ApiError(409, 'Invalid role');
    }

    const userRole = role ? role : "User";

    let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    if (existedUser) {
        if (!existedUser.verified) {
            await User.deleteOne({ useremail: useremail })
        }
        else
            throw new ApiError(409, "User with useremail exists");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        useremail: useremail,
        role: userRole,
        userpassword: userpassword,
        otp: otp
    });

    const mailOptions = {
        from: process.env.USER,
        to: useremail,
        subject: "Welcome to MubyChem",
        text: `please submit OTP to verify: <b>${otp}</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });

    const createdUser = await User.findById(user._id).select(
        "-userpassword -refreshToken -otp"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered Successfully, please submit otp"));
});

export const submitOtp = asyncHandler(async (req, res) => {
    const { useremail, userpassword, otp } = req.body;
    console.log(useremail);

    if (!(useremail && otp && userpassword)) {
        throw new ApiError(400, "useremail,userpassword, and otp is required");
    }

    const user = await User.findOne({ useremail });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(userpassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    if (user.verified) {
        throw new ApiError(401, "User Already Verified");
    }

    const isOtpValid = await user.isOtpCorrect(otp);



    if (!isOtpValid) {
        throw new ApiError(401, "Invalid Otp");
    }

    await User.updateOne({ useremail }, { "$set": { verified: true } });

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );

    console.log("Reached")

    const loggedInUser = await User.findById(user._id).select(
        "-userpassword -refreshToken -otp"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User Verified Successfully"
            )
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { useremail, userpassword } = req.body;

    if (!(useremail && userpassword)) {
        throw new ApiError(400, "useremail and userpassword is required");
    }

    const user = await User.findOne({ useremail: useremail, verified: true });

    if (!user) {
        throw new ApiError(404, "Invalid user credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(userpassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-userpassword -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser
                },
                "User logged In Successfully"
            )
        );
});

export const authCheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: req.user,
                    isAuthenticated: true
                },
                "User logged In Successfully"
            )
        );
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        req.user._id
    );

    const loggedInUser = await User.findById(req.user._id).select(
        "-userpassword -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    isAuthenticated: true
                },
                "User Tokens generated Successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found ")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { username: user.username })
        )
})


export const getTeamMembers = asyncHandler(async (req, res) => {
    const users = await User.find({})

    if (!users || users.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No team members found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Team memeber fetched succefully "));
})

export const removeMember = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found ")
    }

    if (user.role === "Admin") {
        throw new ApiError(403, "Cannot remove an Admin user ")
    }

    await user.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Team member removed successfully"));
})

export const inviteMember = asyncHandler(async (req, res) => {
    const { useremail } = req.body;
    const inviterId = req.user?._id || null; // optional if using auth middleware

    if (!useremail) {
        throw new ApiError(400, "User email is required");
    }

    // Check if already exists
    const existingUser = await User.findOne({ useremail });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    // Generate invite token and expiration
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpires = Date.now() + 1000 * 60 * 60 * 24; // valid 24 hours

    // Create new invited user
    const newUser = await User.create({
        username: "Invited User",
        useremail,
        userpassword: "temporary-password",
        otp: 0,
        verified: false,
        role: "User",
        invitedBy: inviterId,
        inviteToken,
        inviteExpires,
    });

    try {
        const inviteLink = `${process.env.CLIENT_URL}/accept-invite/${inviteToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.USERPASS,
            },
        });

        await transporter.sendMail({
            from: `"Team App" <${process.env.USER}>`,
            to: useremail,
            subject: "You're invited to join our team!",
            html: `
        <h3>Welcome to the Team!</h3>
        <p>You’ve been invited to join our workspace. Click the link below to accept your invitation:</p>
        <a href="${inviteLink}" target="_blank">${inviteLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
        });
    } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, {
                id: newUser._id,
                username: newUser.username,
                useremail: newUser.useremail,
                role: newUser.role,
            }, `Invitation created successfully for ${useremail}`)
        );
});

export const acceptInvite = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { username, userpassword } = req.body;

    if (!username || !userpassword) {
        throw new ApiError(400, "Username and password are required");
    }

    const invitedUser = await User.findOne({
        inviteToken: token,
        inviteExpires: { $gt: Date.now() },
    });

    if (!invitedUser) {
        throw new ApiError(400, "Invalid or expired invitation link");
    }

    invitedUser.username = username;
    invitedUser.userpassword = userpassword;
    invitedUser.verified = true;
    invitedUser.inviteToken = null;
    invitedUser.inviteExpires = null;

    await invitedUser.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Invitation accepted successfully"));
});

// export const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken =
//         req.cookies.refreshToken || req.body.refreshToken;

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "unauthorized request");
//     }

//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         );

//         const user = await User.findById(decodedToken?._id);

//         if (!user) {
//             throw new ApiError(401, "Invalid refresh token");
//         }

//         if (incomingRefreshToken !== user?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used");
//         }

//         const options = {
//             httpOnly: true,
//             secure: true,
//         };

//         const { accessToken, newRefreshToken } =
//             await generateAccessAndRefereshTokens(user._id);

//         return res
//             .status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", newRefreshToken, options)
//             .json(
//                 new ApiResponse(
//                     200,
//                     { accessToken, refreshToken: newRefreshToken },
//                     "Access token refreshed"
//                 )
//             );
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token");
//     }
// });

// export const changeCurrentPassword = asyncHandler(async (req, res) => {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user?._id);
//     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

//     if (!isPasswordCorrect) {
//         throw new ApiError(400, "Invalid old password");
//     }

//     user.password = newPassword;
//     await user.save({ validateBeforeSave: false });

//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "Password changed successfully"));
// });

// export const getCurrentUser = asyncHandler(async (req, res) => {
//     return res
//         .status(200)
//         .json(new ApiResponse(200, req.user, "User fetched successfully"));
// });

// export const updateAccountDetails = asyncHandler(async (req, res) => {
//     const { fullName, email } = req.body;

//     if (!fullName || !email) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {
//                 fullName,
//                 email: email,
//             },
//         },
//         { new: true }
//     ).select("-password");

//     return res
//         .status(200)
//         .json(new ApiResponse(200, user, "Account details updated successfully"));
// });

// export const updateUserAvatar = asyncHandler(async (req, res) => {
//     const avatarLocalPath = req.file?.path;

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is missing");
//     }

//     //TODO: delete old image - assignment

//     const avatar = await uploadOnCloudinary(avatarLocalPath);

//     if (!avatar.url) {
//         throw new ApiError(400, "Error while uploading on avatar");
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {
//                 avatar: avatar.url,
//             },
//         },
//         { new: true }
//     ).select("-password");

//     return res
//         .status(200)
//         .json(new ApiResponse(200, user, "Avatar image updated successfully"));
// });

// export const updateUserCoverImage = asyncHandler(async (req, res) => {
//     const coverImageLocalPath = req.file?.path;

//     if (!coverImageLocalPath) {
//         throw new ApiError(400, "Cover image file is missing");
//     }

//     //TODO: delete old image - assignment

//     const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//     if (!coverImage.url) {
//         throw new ApiError(400, "Error while uploading on avatar");
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {
//                 coverImage: coverImage.url,
//             },
//         },
//         { new: true }
//     ).select("-password");

//     return res
//         .status(200)
//         .json(new ApiResponse(200, user, "Cover image updated successfully"));
// });

// export const getUserChannelProfile = asyncHandler(async (req, res) => {
//     const { username } = req.params;

//     if (!username?.trim()) {
//         throw new ApiError(400, "username is missing");
//     }

//     const channel = await User.aggregate([
//         {
//             $match: {
//                 username: username?.toLowerCase(),
//             },
//         },
//         {
//             $lookup: {
//                 from: "subscriptions",
//                 localField: "_id",
//                 foreignField: "channel",
//                 as: "subscribers",
//             },
//         },
//         {
//             $lookup: {
//                 from: "subscriptions",
//                 localField: "_id",
//                 foreignField: "subscriber",
//                 as: "subscribedTo",
//             },
//         },
//         {
//             $addFields: {
//                 subscribersCount: {
//                     $size: "$subscribers",
//                 },
//                 channelsSubscribedToCount: {
//                     $size: "$subscribedTo",
//                 },
//                 isSubscribed: {
//                     $cond: {
//                         if: { $in: [req.user?._id, "$subscribers.subscriber"] },
//                         then: true,
//                         else: false,
//                     },
//                 },
//             },
//         },
//         {
//             $project: {
//                 fullName: 1,
//                 username: 1,
//                 subscribersCount: 1,
//                 channelsSubscribedToCount: 1,
//                 isSubscribed: 1,
//                 avatar: 1,
//                 coverImage: 1,
//                 email: 1,
//             },
//         },
//     ]);

//     if (!channel?.length) {
//         throw new ApiError(404, "channel does not exists");
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, channel[0], "User channel fetched successfully")
//         );
// });

// export const getWatchHistory = asyncHandler(async (req, res) => {
//     const user = await User.aggregate([
//         {
//             $match: {
//                 _id: new mongoose.Types.ObjectId(req.user._id),
//             },
//         },
//         {
//             $lookup: {
//                 from: "videos",
//                 localField: "watchHistory",
//                 foreignField: "_id",
//                 as: "watchHistory",
//                 pipeline: [
//                     {
//                         $lookup: {
//                             from: "users",
//                             localField: "owner",
//                             foreignField: "_id",
//                             as: "owner",
//                             pipeline: [
//                                 {
//                                     $project: {
//                                         fullName: 1,
//                                         username: 1,
//                                         avatar: 1,
//                                     },
//                                 },
//                             ],
//                         },
//                     },
//                     {
//                         $addFields: {
//                             owner: {
//                                 $first: "$owner",
//                             },
//                         },
//                     },
//                 ],
//             },
//         },
//     ]);

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 user[0].watchHistory,
//                 "Watch history fetched successfully"
//             )
//         );
// });