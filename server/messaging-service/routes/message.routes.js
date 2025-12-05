import express from "express";
import getMessages from "../controllers/getMessages.controller.js";
import messageSend from "../controllers/messageSend.controller.js";

const router = express.Router();

router.get("/get/:receiverId", getMessages);
router.post("/send", messageSend);

export default router;
