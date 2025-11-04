import express from 'express';
import { createCard,getCard,updateCard,deleteCardFile,deleteCard } from './card.controller.js';
import { createCardSchema, createCardParamsSchema, getCardParamsSchema, updateCardSchema, getCardFileParamsSchema } from './card.validators.js';
import { validateBody, validateBodyForm, validateParams } from '../../middleware/validate.middleware.js'; // your middleware path
import authMiddleware from '../../middleware/auth.middleware.js';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../utils/claudinary.js";
import environmentVariables from '../../config/env.js';
import multer from "multer";
// Configure storage to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: environmentVariables.cloudinaryFolderName, // Your folder name in Cloudinary
    resource_type: "auto",  // Auto detects file type (image, pdf, video, etc.)
  },
});

// Multer middleware

const router = express.Router();
const upload = multer({ storage });


router.get('/:boardId/:listId/:cardId',authMiddleware,validateParams(getCardParamsSchema), getCard);
router.post('/:boardId/:listId',authMiddleware,validateBody(createCardSchema),validateParams(createCardParamsSchema), createCard);
router.put('/:boardId/:listId/:cardId',upload.array("files", 5),authMiddleware,validateParams(getCardParamsSchema),validateBodyForm(updateCardSchema), updateCard);
router.delete('/:boardId/:listId/:cardId/:fileId',authMiddleware,validateParams(getCardFileParamsSchema), deleteCardFile);
router.delete('/:boardId/:listId/:cardId',authMiddleware,validateParams(getCardParamsSchema), deleteCard);
// router.delete('/:id',authMiddleware,validateParams(getBoardSchema), deleteBoard);

export default router;