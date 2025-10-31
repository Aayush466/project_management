import express from 'express';
import { createList, updateList,getList,deleteList,archiveList,unArchiveList } from './list.controller.js';
import { createListSchema, createListParamsSchema, getListParamsSchema, updateListSchema } from './list.validators.js';
import { validateBody, validateParams } from '../../middleware/validate.middleware.js'; // your middleware path
import authMiddleware from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:boardId/:listId',authMiddleware,validateParams(getListParamsSchema), getList);
router.post('/:boardId',authMiddleware,validateBody(createListSchema),validateParams(createListParamsSchema), createList);
router.put('/:boardId/:listId',authMiddleware,validateParams(getListParamsSchema),validateBody(updateListSchema), updateList);
router.put('/:boardId/:listId/archive',authMiddleware,archiveList);
router.put('/:boardId/:listId/unarchive',authMiddleware,unArchiveList);
router.delete('/:boardId/:listId',authMiddleware,validateParams(getListParamsSchema), deleteList);

export default router;