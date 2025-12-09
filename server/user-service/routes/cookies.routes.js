import express from "express";
import {themeCookies} from "../controllers/Ui_Cookies/themeCookies.controller.js";
const router = express.Router();

// router.post("/get/:userId", );
router.post("/theme/set", themeCookies );

export default router;
