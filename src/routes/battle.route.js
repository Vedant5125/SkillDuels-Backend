// routes/battle.route.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLeaderboard } from "../controllers/user.controller.js";
import Battle from "../models/battle.model.js";

const router = Router();

// Public: Everyone can see the leaderboard
router.route("/leaderboard").get(getLeaderboard);

// Private: Only the logged-in user can see their history
router.route("/history").get(verifyJWT, async (req, res) => {
    try {
        const history = await Battle.find({
            "players.user": req.user._id
        })
        .sort({ playedAt: -1 })
        .populate("players.user", "fullname")
        .populate("winner", "fullname");

        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;