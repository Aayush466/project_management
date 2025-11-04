import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "./user/user.model"
import environmentVariables from "../config/env"
import { sendResetOtpService } from "../utils/sendEmail"

export const generateOtpCode = () =>{
    Math.floor(100000+ Math.random()* 900000).toString();
}

export const registerUser = asyncHandler(async(req , res , next )=>{
    const {userName , fullName , passsword , email } = req.body;

    if([userName , fullName , passsword , email ].some((item)=> item?.trim()==="")){
        throw new ApiError()
    }
}) 

export const createBoard = async(req , res , next ) =>{
    try {
        const newBoard = await boardService.createBoard({
            createdBy: req.user._id,
            ...req.body
        })

        await User.findByIdAndUpdate(req.user._id,{
            $addToSet:{ myBoards: newBoard._id},
        });

        res.status(201).json({
            success:true,
            message :"Board created successFully",
            data: newBoard,
        });

    } catch (error) {
        next(err)
    }
}

export const getBoard = async(req , res, next) =>{
    try {
        if(!req.user.myBoards.some((b)=> b.equals(req.params.boardId))){
            return res.status(400).json({ message :"Board does not exists "});
        }

        const board = await boardService.getBoard({_id: req.params.boardId});

        res.status(201).json({
            success:true,
            message:"Board fetched SuccessFully ",
            data : board,
        })
    } catch (error) {
        next(err);
    }
}

// if(!req.user.myBoards.some(b => b.toString() === req.params.boardId)){
//     return res.status(400).json({message: "Baord not exists "})
// }