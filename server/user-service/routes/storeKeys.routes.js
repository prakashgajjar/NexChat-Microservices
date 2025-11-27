import express from "express";
import { storeKeys } from "../controllers/storeKeys.controller.js";

const router = express.Router();

// router.post("/get/:userId", );
router.post("/store",storeKeys );

export default router;
