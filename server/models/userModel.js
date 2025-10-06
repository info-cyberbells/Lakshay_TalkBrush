import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    type: {
        type: String,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
