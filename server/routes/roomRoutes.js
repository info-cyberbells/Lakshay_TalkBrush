import express from "express";
import { createRoom, addMember } from "../controllers/roomController.js";

const router = express.Router();

router.post("/create-room", createRoom);
router.post("/add-member", addMember);

export default router;
