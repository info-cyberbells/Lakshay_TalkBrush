import express from "express";
import { createRoom, addMember, getRoomDetails, leaveRoom } from "../controllers/roomController.js";

const router = express.Router();

router.post("/create-room", createRoom);
router.post("/add-member", addMember);
router.get("/room/:room_code/info", getRoomDetails);
router.post("/leave-room", leaveRoom);


export default router;
