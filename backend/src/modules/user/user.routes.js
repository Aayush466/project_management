import express from 'express';
import { getUsers,getUser, createUser, approveUser, rejectUser, updateAdmin, updateUser } from './user.controller.js';
import { createUserSchema, approveUserSchema, rejectUserSchema, updateAdminSchema, updateUserSchema } from './user.validators.js';
import { validateBody } from '../../middleware/validate.middleware.js'; // your middleware path
import authMiddleware from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/all',authMiddleware, getUsers);
router.get('/profile',authMiddleware, getUser);
router.post('/register', validateBody(createUserSchema), createUser);
router.post('/approve', authMiddleware,validateBody(approveUserSchema), approveUser);
router.post('/reject', authMiddleware,validateBody(rejectUserSchema), rejectUser);
router.put('/admin-profile', authMiddleware,validateBody(updateAdminSchema), updateAdmin);
router.put('/user-profile', authMiddleware,validateBody(updateUserSchema), updateUser);

export default router;
