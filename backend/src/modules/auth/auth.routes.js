import express from 'express';
import { login, refreshToken, logout, submitUserOtp, sendResetOtp, submitResetOtp, resetPassword } from './auth.controller.js';
import {loginUserSchema, resetPasswordSchema, sendResetOtpSchema, submitOtpSchema, submitResetOtpSchema} from "./auth.validators.js";
import { validateBody } from '../../middleware/validate.middleware.js';

const router = express.Router();

router.post('/login',validateBody(loginUserSchema), login);
router.post('/submit-otp',validateBody(submitOtpSchema), submitUserOtp);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/send-reset-otp',validateBody(sendResetOtpSchema), sendResetOtp);
router.post('/submit-reset-otp',validateBody(submitResetOtpSchema), submitResetOtp);
router.post('/reset-password',validateBody(resetPasswordSchema), resetPassword);

export default router;
