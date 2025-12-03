import express from "express";
import getAllUsers from "../controllers/getAllUsers.controller.js";
import getUser from "../controllers/getUser.controller.js";

const router = express.Router();

// router.post("/get/:userId", );
router.get("/all",getAllUsers );
router.get("/id/:userId", getUser);

export default router;
