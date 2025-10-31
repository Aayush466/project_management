import Board from "./board.model.js";

export const createBoard = async (data) => {
  const board = new Board(data);
  const savedBoard = await  board.save();

  return savedBoard;
};

export const getBoard = async (condition) => {
  return await Board.findOne(condition).populate({
    path: 'createdBy',
    select: '-password -refreshToken -resetExpiresAt -__v -reset -expiresOtpAt -hashedCode',
  }).populate({
      path: 'lists',
      select: '-board',
      populate: {
        path: 'cards',
        select: '-list', // optional: prevent circular reference
      },
    });
};

export const updateBoard = async (condition,data) => {
  return await Board.updateOne(condition,{$set:data});
};

export const deleteBoard = async (condition) => {
  return await Board.deleteOne(condition);
};