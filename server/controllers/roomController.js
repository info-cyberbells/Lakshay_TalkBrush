import { Room } from "../models/RoomModel.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";


export const createRoom = async (req, res) => {
    try {
        const token = req.cookies?.authToken || req.headers["authorization"];
        let initiator_id = "guest";
        let initiator_name = req.body.initiator_name || null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);


                const user = await User.findById(decoded.id);

                if (user) {
                    initiator_id = user._id.toString();

                    if (!req.body.initiator_name) {
                        initiator_name = user.fullName || user.name;
                    }
                }
            } catch (e) {
                console.log("Invalid Token or DB error, using guest mode:", e.message);
            }
        }


        if (!initiator_name) {
            return res.status(400).json({
                success: false,
                message: "initiator_name is required (or token must be valid)"
            });
        }

        const { room_code } = req.body;

        if (!room_code) {
            return res.status(400).json({
                success: false,
                message: "room_code is required"
            });
        }

        const exists = await Room.findOne({ room_code });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Room code already exists"
            });
        }

        const newRoom = await Room.create({
            room_code,
            initiator_id,
            initiator_name,
            members: [
                { user_id: initiator_id, username: initiator_name }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Room created successfully",
            room: newRoom
        });

    } catch (error) {
        console.log("Create Room Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const addMember = async (req, res) => {
    try {
        const token = req.cookies?.authToken || req.headers["authorization"];
        let user_id = req.body.user_id || "guest";
        let username = req.body.username || null;


        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);


                const user = await User.findById(decoded.id);

                if (user) {
                    user_id = user._id.toString();


                    if (!req.body.username) {
                        username = user.fullName || user.name;
                    }
                }
            } catch (err) {
                console.log("Invalid token or DB error → fallback to request body:", err.message);
            }
        }

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "username is required (or token must be valid)"
            });
        }

        const { room_code } = req.body;

        if (!room_code) {
            return res.status(400).json({
                success: false,
                message: "room_code is required"
            });
        }

        const room = await Room.findOne({ room_code });
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const exists = room.members.some(m => m.user_id === user_id);

        if (!exists) {
            room.members.push({ user_id, username });
            room.members_joined = room.members.length;
            await room.save();
        }

        return res.json({
            success: true,
            room
        });

    } catch (error) {
        console.error("Add Member Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


//get room details
export const getRoomDetails = async (req, res) => {
    try {
        const { room_code } = req.params;

        if (!room_code) {
            return res.status(400).json({
                success: false,
                message: "room_code is required",
            });
        }

        const room = await Room.findOne({ room_code });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        const response = {
            success: true,
            room_code: room.room_code,
            initiator_id: room.initiator_id,
            initiator_name: room.initiator_name,
            created_at: room.created_at,
            members_joined: room.members.length,
            members: room.members,
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error("Get Room Details Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
