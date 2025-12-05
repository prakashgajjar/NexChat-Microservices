import express from "express";
import getAllUsers from "../controllers/getAllUsers.controller.js";
import getUser from "../controllers/getUser.controller.js";
import getMe from "../controllers/me.controller.js";


const router = express.Router();

// router.post("/get/:userId", );
router.get("/all",getAllUsers );
router.get("/id/:userId", getUser);
router.get("/me", getMe);

export default router;
