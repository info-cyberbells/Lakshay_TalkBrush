import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room_code: {
        type: String,
        required: true,
        unique: true
    },

    initiator_id: { type: String, default: "guest" },
    initiator_name: { type: String, required: true },

    created_at: { type: Date, default: Date.now },

    members_joined: { type: Number, default: 1 },

    members: [
        {
            user_id: String,
            username: String,
            joined_at: { type: Date, default: Date.now }
        }
    ],

    activity_log: [
        {
            user_id: String,
            username: String,
            joined_at: Date,
            left_at: Date
        }
    ]
});

export const Room =
  mongoose.models.Room || mongoose.model("Room", roomSchema);
