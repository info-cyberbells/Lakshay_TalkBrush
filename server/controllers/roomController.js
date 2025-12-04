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
                console.log("Token error → using req.body:", err.message);
            }
        }

        if (!username) {
            return res.status(400).json({ success: false, message: "username is required" });
        }

        const { room_code } = req.body;

        const room = await Room.findOne({ room_code });
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const alreadyInside = room.members.some(m => m.user_id === user_id);
        const hasEverJoined = room.activity_log.some(log => log.user_id === user_id);
        if (!hasEverJoined) {
            room.members_joined += 1;
        }

        if (!alreadyInside) {
            // Add to ACTIVE users
            room.members.push({ user_id, username, joined_at: new Date() });

            // Add to HISTORY log
            room.activity_log.push({
                user_id,
                username,
                joined_at: new Date(),
                left_at: null
            });
        }
        await room.save();

        return res.json({ success: true, room });

    } catch (error) {
        console.error("Add Member Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
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

        const BASE_URL = `${req.protocol}://${req.get("host")}`;

        const initiator = await User.findById(room.initiator_id).select('image');
        const initiator_image = initiator?.image ? `${BASE_URL}${initiator.image}` : null;

        const memberIds = room.members.map(member => member.user_id);
        const users = await User.find({ _id: { $in: memberIds } }).select('_id image');

        const userImageMap = {};
        users.forEach(user => {
            userImageMap[user._id.toString()] = user.image ? `${BASE_URL}${user.image}` : null;
        });

        const membersWithImages = room.members.map(member => ({
            user_id: member.user_id,
            username: member.username,
            profile_image: userImageMap[member.user_id] || null,
            _id: member._id,
            joined_at: member.joined_at
        }));

        const response = {
            success: true,
            room_code: room.room_code,
            initiator_id: room.initiator_id,
            initiator_name: room.initiator_name,
            initiator_image: initiator_image,
            created_at: room.created_at,
            members_joined: room.members_joined,
            members: membersWithImages,
            activity_log: room.activity_log
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


//leave room 
export const leaveRoom = async (req, res) => {
    try {
        const token = req.cookies?.authToken || req.headers["authorization"];
        let user_id = req.body.user_id || null;

        // 🔥 Extract user ID from token if available
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.id; // override with real user ID
            } catch (err) {
                console.log("Invalid token during leave:", err.message);
            }
        }

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User identification failed (no token or user_id)."
            });
        }

        const { room_code } = req.body;

        const room = await Room.findOne({ room_code });
        const isHost = room.initiator_id === user_id;

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        room.members = room.members.filter(m => m.user_id !== user_id);

        if (isHost) {
            const leaveTime = new Date();

            room.activity_log.forEach(log => {
                if (!log.left_at) {
                    log.left_at = leaveTime;
                }
            });

            room.members = [];
            await room.save();

            return res.json({
                success: true,
                message: "Host left — room ended for all members"
            });
        }


        const lastLog = [...room.activity_log]
            .reverse()
            .find(log => log.user_id === user_id && !log.left_at);

        if (lastLog) {
            lastLog.left_at = new Date();
        }


        await room.save();

        return res.json({ success: true });

    } catch (error) {
        console.error("Leave Room Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
