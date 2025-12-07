import express from "express";
import getAllUsers from "../controllers/getAllUsers.controller.js";
import getUser from "../controllers/getUser.controller.js";
import getMe from "../controllers/me.controller.js";
import {setUsername} from "../controllers/SetUsername.controller.js";
import {checkUsername} from "../controllers/checkUsername.controller.js";
import getAllSearchedUsers from "../controllers/getSearchUser.controller.js";
import {getContacts} from "../controllers/getAllContacts.controller.js";


const router = express.Router();

// router.post("/get/:userId", );
router.get("/all",getAllUsers );
router.get("/id/:userId", getUser);
router.get("/search/:username", getAllSearchedUsers);
router.get("/me", getMe);
router.post("/username/check", checkUsername);
router.post("/username/set", setUsername);
router.post("/contacts/get", getContacts);


export default router;
