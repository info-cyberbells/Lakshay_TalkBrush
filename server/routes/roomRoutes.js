import express from "express";
import { createRoom, addMember, getRoomDetails  } from "../controllers/roomController.js";

const router = express.Router();

router.post("/create-room", createRoom);
router.post("/add-member", addMember);
router.get("/room/:room_code/info", getRoomDetails);

export default router;
