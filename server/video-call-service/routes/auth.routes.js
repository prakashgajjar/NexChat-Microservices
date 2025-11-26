import express from "express";
import { login, logout, refresh } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout",verifyToken, logout);

export default router;
