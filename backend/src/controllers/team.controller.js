import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { TeamMember } from "../models/team.model.js";
import { User } from "../models/user.model.js";

export const getTeamMembers = asyncHandler(async (req, res) => {
    const members = await TeamMember.find();

    if (!members || members.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No team members found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, members, "Team members fetched successfully"));
});

export const removeMember = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const member = await TeamMember.findById(id);
    if (!member) {
        throw new ApiError(404, "Team member not found");
    }

    // Optional: prevent deleting admin (if role field exists in your User model)
    if (member.role && member.role.toLowerCase() === "admin") {
        throw new ApiError(403, "Cannot remove an Admin member");
    }

    await member.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Team member removed successfully"));
});

export const inviteMember = asyncHandler(async (req, res) => {
    const { useremail } = req.body;
    // const inviterId = req.user?._id || null; // optional if using auth middleware

    if (!useremail) {
        throw new ApiError(400, "User email is required");
    }

    const existingUser = await TeamMember.findOne({ useremail });
    if (!existingUser) {
        // User not found, don't send email
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User with this email not found in the database"));
    }

    // Generate invite token and expiration (valid 24 hours)
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpires = Date.now() + 1000 * 60 * 60 * 24;

    // Create new invited record
    const newMember = await TeamMember.create({
        useremail,
        inviteToken,
        inviteExpires,
        verified: false,
    });

    // Send invitation email
    try {
        const inviteLink = `${process.env.CLIENT_URL}/accept-invite/${inviteToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,      // your Gmail address
                pass: process.env.USERPASS,  // your app password
            },
        });

        await transporter.sendMail({
            from: `"Team App" <${process.env.USER}>`,
            to: useremail, // ✅ using useremail
            subject: "You're invited to join our team!",
            html: `
        <h3>Welcome to the Team!</h3>
        <p>You’ve been invited to join our workspace. Click the link below to accept your invitation:</p>
        <a href="${inviteLink}" target="_blank">${inviteLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
        });

        console.log(`✅ Invitation email sent to ${useremail}`);
    } catch (emailError) {
        console.error("❌ Email sending failed:", emailError.message);
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                id: newMember._id,
                useremail: newMember.useremail,
                inviteToken: newMember.inviteToken,
            },
            `Invitation sent successfully to ${useremail}`
        )
    );
});
