import * as listService from "./list.service.js";
import Board from "../board/board.model.js";
import User from "../user/user.model.js";
import * as boardService from "../board/board.service.js";
import cloudinary from "../../utils/claudinary.js";
import Card from "../card/card.model.js";
import List from "./list.model.js";

export const createList = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const newList = await listService.createList({
      board: req.params.boardId,
      ...req.body,
    });

    await Board.findByIdAndUpdate(req.params.boardId, {
      $addToSet: { lists: newList._id },
    });

    res.status(201).json({
      success: true,
      message: "List created Successfully",
      data: newList,
    });
  } catch (err) {
    next(err);
  }
};

export const updateList = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const list = await listService.getList({
      _id: req.params.listId,
      board: req.params.boardId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    list.title = req.body.title || list.title;
    list.color = req.body.color || list.color;

    await list.save();

    res.status(201).json({
      success: true,
      message: "List updated successfully",
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const getList = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const list = await listService.getList({
      _id: req.params.listId,
      board: req.params.boardId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    res.status(201).json({
      success: true,
      message: "List fetched successfully",
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteList = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const list = await listService.getDeleteList({
      _id: req.params.listId,
      board: req.params.boardId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    if (list.trash) {
      return res
        .status(404)
        .json({ success: false, message: "List is already in trash" });
    }

    list.trash = true;
    list.save();

    await Board.updateOne(
      { _id: req.params.boardId },
      { $addToSet: { trashLists: list._id } }
    );

    res.status(201).json({
      success: true,
      message: "List moved to trash",
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const restoreList = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const list = await listService.getList({
      _id: req.params.listId,
      board: req.params.boardId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    if (!list.trash) {
      return res
        .status(404)
        .json({ success: false, message: "List not exists in trash" });
    }

    list.trash = false;
    list.save();

    await Board.updateOne(
      { _id: req.params.boardId },
      { $pull: { trashLists: list._id } }
    );

    res.status(201).json({
      success: true,
      message: "List restored successfully",
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const permanentlyDeleteList = async (req, res, next) => {
  try {
    if (!req.user.myBoards.some((b) => b.equals(req.params.boardId))) {
      return res.status(400).json({ message: "board does not exists" });
    }

    const list = await listService.getDeletePermanentList({
      _id: req.params.listId,
      board: req.params.boardId,
    });

    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    if (!list.trash) {
      return res
        .status(404)
        .json({ success: false, message: "List not exists in trash" });
    }

    let cardIds = [];
    let attachmentIds = [];

    for (const card of list.cards) {
      attachmentIds = [
        ...attachmentIds,
        ...card.attachments.map((file) => file.fileId),
      ];
      cardIds = [...cardIds, card._id];
    }

    await Promise.all(
      attachmentIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    await Card.deleteMany({ _id: { $in: cardIds } });

    await List.deleteOne({ _id: req.params.listId });

    await Board.updateOne(
      { _id: req.params.boardId },
      { $pull: { lists: req.params.listId, trashLists: req.params.listId } }
    );

    res.status(201).json({
      success: true,
      message: "List permanently deleted",
      data: {_id:list._id,title:list.title},
    });
  } catch (err) {
    next(err);
  }
};
