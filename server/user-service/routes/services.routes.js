import express from "express";
import { addContact } from "../controllers/addContacts.controller.js";

const router = express.Router();

router.post("/contacts/add", addContact);
// router.post("/contacts/set", addContact);

export default router;
