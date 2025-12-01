import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room_code: {
        type: String,
        required: true,
        unique: true
    },

    initiator_id: {
        type: String,
        default: "guest"
    },

    initiator_name: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    members_joined: {
        type: Number,
        default: 1
    },

    members: [
        {
            user_id: { type: String, default: "guest" },
            username: String,
            joined_at: { type: Date, default: Date.now }
        }
    ]
});

export const Room = mongoose.model("Room", roomSchema);
