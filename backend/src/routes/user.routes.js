import { Router } from "express";
import {
  authCheck,
  loginUser,
  registerUser,
  submitOtp,
  refreshToken,
  logoutUser,
  getUserProfile,
  getTeamMembers,
  inviteMember,
  removeMember,
  acceptInvite

} from "../controllers/user.controller.js";

import { verifyAccessToken, verifyRefreshToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/submit-otp").post(submitOtp);

router.route("/login").post(loginUser);

router.route("/check").get(verifyAccessToken, authCheck);
router.route("/refresh-token").post(verifyRefreshToken, refreshToken);
router.route("/logout").post(verifyAccessToken, logoutUser);
router.route("/profile").get(verifyAccessToken, getUserProfile);


// team page routing 
router.route("/team").get(verifyAccessToken, getTeamMembers);
router.route("/invite").post(inviteMember);
router.route("/id").delete(verifyAccessToken, removeMember);
router.route("/accept-invite/:token").post(verifyAccessToken, acceptInvite);

// router.route("/login").post(loginUser);

//secured routes
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/change-password").post(verifyJWT, changeCurrentPassword);
// router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// router
//   .route("/avatar")
//   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
// router
//   .route("/cover-image")
//   .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
// router.route("/history").get(verifyJWT, getWatchHistory);

export default router;