import express from "express";
import { storeUserData } from "../controllers/storeUserData.controller.js";
import getPublicKey from "../controllers/getPublicKey.controller.js";

const router = express.Router();

// router.post("/get/:userId", );
router.post("/store",storeUserData );
router.get("/get-public-key/:userId", getPublicKey);

export default router;
