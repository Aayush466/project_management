import express from 'express';
import { getUsers,getUser, createUser, sendInvite, acceptInvite, rejectInvite,approveUser } from './user.controller.js';
import { createUserSchema, sendInviteSchema,acceptInviteSchema, rejectInviteSchema,approveUserSchema } from './user.validators.js';
import { validateBody } from '../../middleware/validate.middleware.js'; // your middleware path
import authMiddleware from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/all',authMiddleware, getUsers);
router.get('/profile',authMiddleware, getUser);
// router.get('/invitations', authMiddleware, getInvitations);
router.post('/register', validateBody(createUserSchema), createUser);
router.post('/approve', authMiddleware,validateBody(approveUserSchema), approveUser);
router.post('/send-invite', validateBody(sendInviteSchema),authMiddleware, sendInvite);
router.post('/accept-invite', validateBody(acceptInviteSchema),authMiddleware, acceptInvite);
router.post('/reject-invite', validateBody(rejectInviteSchema),authMiddleware, rejectInvite);

export default router;