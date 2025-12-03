import express from "express";
import { login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {logout} from "../controllers/logout.controller.js"
import {refresh} from "../controllers/refresh.controller.js"
const router = express.Router();

router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout",verifyToken, logout);

export default router;
