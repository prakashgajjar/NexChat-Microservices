import express from "express";
import { updateChatBgUrl } from "../controllers/ChangeBg.controller.js";

const router = express.Router();

router.post("/bg/update",updateChatBgUrl );


export default router;
