import Board from "./board.model.js";

export const createBoard = async (data) => {
  const board = new Board(data);
  const savedBoard = await  board.save();

  return savedBoard;
};

export const getBoard = async (condition) => {
  return await Board.findOne(condition).select("-createdBy").populate({
      path: 'lists',
      select: '-board -color',
      populate: {
        path: 'cards',
        select: '-color -status -priority -checkLists -attachments -list', // optional: prevent circular reference
      },
    }).populate({path:"trashCards",select:"-color -status -priority -checkLists -attachments"}).populate({path:"trashLists",select:"-cards"});
};

export const getDeletePermanentlyBoard = async (condition) => {
  return await Board.findOne(condition).select("-createdBy").populate({
      path: 'lists',
      select: '-board -color',
      populate: {
        path: 'cards',
        select: '-color -status -priority -checkLists -list', // optional: prevent circular reference
      },
    });
};

export const getRestoreDeleteBoard = async (condition) => {
  return await Board.findOne(condition).select("-createdBy -lists -trashCards -trashLists");
};

export const updateBoard = async (condition,data) => {
  return await Board.updateOne(condition,{$set:data});
};

export const deleteBoard = async (condition) => {
  return await Board.deleteOne(condition);
};