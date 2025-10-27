import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import nodemailer from "nodemailer"
import crypto from "crypto"
import { TeamMember } from "../models/team.model.js";


export const getTeamMembers = asyncHandler(async(req , res)=>{
    const members = await TeamMember.find();

    if(!members || members.length === 0 ){
        return res 
        .status(200)
        .json(new ApiResponse(200, [], "No team member found "))
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, members , "team memeber "))
})