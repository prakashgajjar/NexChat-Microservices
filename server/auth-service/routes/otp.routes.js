import express from "express";
import { sendOtp } from "../controllers/otp.controller.js";
import { verifyOtp } from "../controllers/verifyOtp.controller.js";
const router = express.Router();

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

export default router;
