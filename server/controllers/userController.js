import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

// User Signup Controller
export const signupUser = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, location, type } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            fullName,
            phoneNumber,
            email,
            password: hashedPassword,
            // location,
            type,
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                // number: user.number,
                // location: user.location,
                type: user.type,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
