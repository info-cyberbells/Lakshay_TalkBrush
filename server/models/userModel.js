import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
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
    phoneNumber: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    type: {
        type: String,
    },
    lastLogin: {
        type: Date,
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
