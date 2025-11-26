import * as cardService from "./card.service.js";
import List from "../list/list.model.js";
import User from "../user/user.model.js";
import * as listService from "../list/list.service.js";
import cloudinary from "../../utils/claudinary.js";
import environmentVariables from "../../config/env.js";
import Board from "../board/board.model.js";

export const createCard = async (req, res, next) => {
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

    const newCard = await cardService.createCard({
      list: req.params.listId,
      ...req.body,
    });

    await List.findByIdAndUpdate(req.params.listId, {
      $addToSet: { cards: newCard._id },
    });

    res.status(201).json({
      success: true,
      message: "Card created Successfully",
      data: newCard,
    });
  } catch (err) {
    next(err);
  }
};

export const getCard = async (req, res, next) => {
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

    const card = await cardService.getCard({
      _id: req.params.cardId,
      list: req.params.listId,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    res.status(201).json({
      success: true,
      message: "Card fetched Successfully",
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCard = async (req, res, next) => {
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

    const card = await cardService.getCard({
      _id: req.params.cardId,
      list: req.params.listId,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    // Check files
    if (req.files) {
      if (req.files.length != 0) {
        const newAttachments = req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: file.path,
          fileType: file.mimetype,
          fileId: file.filename,
        }));

        card.attachments = [...(card.attachments || []), ...newAttachments];
      }
    }

    card.title = req.body.title || card.title;
    card.description = req.body.description || card.description;
    card.color = req.body.color || card.color;
    card.status = req.body.status || card.status;
    card.priority = req.body.priority || card.priority;
    if (req.body.dueDateTime === "none" || req.body.dueDateTime === "") {
      // If "none" or empty → clear dueDateTime
      card.dueDateTime = null;
    } else if (req.body.dueDateTime) {
      // If date provided → update date
      card.dueDateTime = req.body.dueDateTime;
    } else {
      // If not provided → keep existing
      card.dueDateTime = card.dueDateTime;
    }
    card.checkLists = req.body.checkLists
      ? JSON.parse(req.body.checkLists)
      : card.checkLists;

    await card.save();

    res.status(201).json({
      success: true,
      message: "Card updated successfully",
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCardFile = async (req, res, next) => {
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

    const card = await cardService.getCard({
      _id: req.params.cardId,
      list: req.params.listId,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    const attachmentFile = card.attachments.filter(
      (file) => file.fileId.split("/").pop() == req.params.fileId
    );

    if (attachmentFile.length == 0)
      return res
        .status(404)
        .json({ success: false, message: "attachment not found" });

    card.attachments = card.attachments.filter(
      (file) => file.fileId.split("/").pop() !== req.params.fileId
    );

    await cloudinary.uploader.destroy(`${environmentVariables.cloudinaryFolderName}/` + req.params.fileId);

    await card.save();

    res.status(201).json({
      success: true,
      message: "Card Attachment removed successfully",
      data: attachmentFile[0],
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
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

    const card = await cardService.getDeleteCard({
      _id: req.params.cardId,
      list: req.params.listId,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    if(card.trash)
      {
      return res
        .status(404)
        .json({ success: false, message: "Card is already in trash" });
    }

    card.trash=true;
    card.save();

    await Board.updateOne({_id:req.params.boardId},{$addToSet:{trashCards:card._id}})
    
    res.status(201).json({
      success: true,
      message: "Card moved to in trash successfully",
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

export const restoreCard = async (req, res, next) => {
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

    const card = await cardService.getCard({
      _id: req.params.cardId,
      list: req.params.listId,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    if(!card.trash)
      {
      return res
        .status(404)
        .json({ success: false, message: "Card not exists in trash" });
    }

    card.trash=false;
    card.save();

    await Board.updateOne({_id:req.params.boardId},{$pull:{trashCards:card._id}})    

    res.status(201).json({
      success: true,
      message: "Card restored successfully",
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

export const permanentlyDeleteCard = async (req, res, next) => {
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

    const card = await cardService.getCard({
      _id: req.params.cardId,
      list: req.params.listId,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    if(!card.trash)
      {
      return res
        .status(404)
        .json({ success: false, message: "Card is not in trash" });
    }
    

    await Promise.all(
      card.attachments.map((file) => cloudinary.uploader.destroy(file.fileId))
    );

    await cardService.deleteCard({ _id: req.params.cardId });
    
        await List.updateOne(
  { _id: req.params.listId },
  { $pull: { cards: req.params.cardId } }
)

    await Board.updateOne({_id:req.params.boardId},{$pull:{trashCards:card._id}})    

    res.status(201).json({
      success: true,
      message: "Card deleted permanently",
      data: {_id:card._id,title:card.title},
    });
  } catch (err) {
    next(err);
  }
};
