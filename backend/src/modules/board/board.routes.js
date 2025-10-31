import express from 'express';
import { createBoard,getBoard,updateBoard,deleteBoard } from './board.controller.js';
import { createBoardSchema, getBoardSchema, updateBoardSchema } from './board.validators.js';
import { validateBody, validateParams } from '../../middleware/validate.middleware.js'; // your middleware path
import authMiddleware from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:boardId',authMiddleware,validateParams(getBoardSchema), getBoard);
router.post('/',authMiddleware,validateBody(createBoardSchema), createBoard);
router.put('/:boardId',authMiddleware,validateParams(getBoardSchema),validateBody(updateBoardSchema), updateBoard);
router.delete('/:boardId',authMiddleware,validateParams(getBoardSchema), deleteBoard);

export default router;