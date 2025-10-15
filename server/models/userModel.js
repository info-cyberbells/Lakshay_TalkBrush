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
    type: Number,  // or String if you’re using role names
    enum: [1, 2, 3], // optional, helps restrict to valid values
    default: 3,     // 👈 sets default role as Type 3
    },
    // type: {
    //     type: String,
    // }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
