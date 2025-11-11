import * as boardService from "./board.service.js";
import User from "../user/user.model.js";
import cloudinary from "../../utils/claudinary.js";
import Card from "../card/card.model.js";
import List from "../list/list.model.js";

export const createBoard = async (req, res, next) => {
  try {
    const newBoard = await boardService.createBoard({
      createdBy: req.user._id,
      ...req.body,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { myBoards: newBoard._id },
    });

    res.status(201).json({
      success: true,
      message: "Board created Successfully",
      data: newBoard,
    });
  } catch (err) {
    next(err);
  }
};

export const getBoard = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const board = await boardService.getBoard({ _id: req.params.boardId });

    res.status(201).json({
      success: true,
      message: "Board fetched successfully",
      data: board,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const board = await boardService.getBoard({ _id: req.params.boardId });

    board.title = req.body.title;
    board.save();

    res.status(201).json({
      success: true,
      message: "Board updated successfully",
      data: board,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const board = await boardService.getBoard({ _id: req.params.boardId });

    // let listIds = [];
    // let cardIds = [];
    // let attachmentIds = [];

    // for (const list of board.lists) {
    //   listIds = [...listIds, list._id];

    //   for (const card of list.cards) {
    //     attachmentIds = [
    //       ...attachmentIds,
    //       ...card.attachments.map((file) => file.fileId),
    //     ];
    //     cardIds = [...cardIds, card._id];
    //   }
    // }

    //       await Promise.all(
    //     attachmentIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    //   );

    //   await Card.deleteMany({ _id: { $in: cardIds } });

    //   await List.deleteMany({ _id: { $in: listIds } });

    // await boardService.deleteBoard({ _id: req.params.boardId });

    // await User.findByIdAndUpdate(req.user._id, {
    //   $pull: { myBoards: req.params.boardId },
    // });

    if (board.trash) {
      return res
        .status(404)
        .json({ success: false, message: "Board is already in trash" });
    }

    board.trash = true;
    board.save();

    await User.updateOne(
      { email: req.user.email },
      { $addToSet: { trashBoards: board._id } }
    );

    res.status(201).json({
      success: true,
      message: "Board moved to trash",
      data: board,
    });
  } catch (err) {
    next(err);
  }
};

export const restoreBoard = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const board = await boardService.getBoard({ _id: req.params.boardId });

    // let listIds = [];
    // let cardIds = [];
    // let attachmentIds = [];

    // for (const list of board.lists) {
    //   listIds = [...listIds, list._id];

    //   for (const card of list.cards) {
    //     attachmentIds = [
    //       ...attachmentIds,
    //       ...card.attachments.map((file) => file.fileId),
    //     ];
    //     cardIds = [...cardIds, card._id];
    //   }
    // }

    //       await Promise.all(
    //     attachmentIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    //   );

    //   await Card.deleteMany({ _id: { $in: cardIds } });

    //   await List.deleteMany({ _id: { $in: listIds } });

    // await boardService.deleteBoard({ _id: req.params.boardId });

    // await User.findByIdAndUpdate(req.user._id, {
    //   $pull: { myBoards: req.params.boardId },
    // });

    if (!board.trash) {
      return res
        .status(404)
        .json({ success: false, message: "Board not exists in trash" });
    }

    board.trash = false;
    board.save();

    await User.updateOne(
      { email: req.user.email },
      { $pull: { trashBoards: board._id } }
    );

    res.status(201).json({
      success: true,
      message: "Board restored successfully",
      data: board,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePermanentlyBoard = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const board = await boardService.getBoard({ _id: req.params.boardId });

    if (!board.trash) {
      return res
        .status(404)
        .json({ success: false, message: "Board not exists in trash" });
    }

    let listIds = [];
    let cardIds = [];
    let attachmentIds = [];

    for (const list of board.lists) {
      listIds = [...listIds, list._id];

      for (const card of list.cards) {
        attachmentIds = [
          ...attachmentIds,
          ...card.attachments.map((file) => file.fileId),
        ];
        cardIds = [...cardIds, card._id];
      }
    }

    await Promise.all(
      attachmentIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    await Card.deleteMany({ _id: { $in: cardIds } });

    await List.deleteMany({ _id: { $in: listIds } });

    await boardService.deleteBoard({ _id: req.params.boardId });

    await User.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          myBoards: req.params.boardId,
          trashBoards: board._id,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Board deleted successfully",
      data: board,
    });
  } catch (err) {
    next(err);
  }
};
