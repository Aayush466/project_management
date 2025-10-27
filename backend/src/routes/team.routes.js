import { Router } from "express";
import { getTeamMembers, removeMember, inviteMember } from "../controllers/team.controller.js";
// import { verifyAccessToken, verifyRefreshToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/team-member").get(getTeamMembers);
router.route("/invite").post(inviteMember);
router.route("/:id").delete(removeMember);
// router.route("/accept-invite/:token").post(verifyAccessToken, acceptInvite);

export default router;