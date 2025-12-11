import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// Login Controller
export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (email) {
            email = email.trim().toLowerCase();
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        await User.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        const host = `${req.protocol}://${req.get('host')}`;

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        const maxAge = 7 * 24 * 60 * 60 * 1000;

        // for live https deployment
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge,
        })


        //for local/ip teting for http
        // res.cookie("authToken", token, {
        //     httpOnly: false,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge,
        // })

            .status(200)
            .json({
                token,
                user: {
                     id: user._id, 
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    type: user.type,
                    profileImage: user.image
                        ? `${host}/${user.image.replace(/^\/+/, "")}`
                        : null
                },
            });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Verify token from cookie
export const verifyToken = async (req, res) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // const { _id, name, email, type } = user;
        res.json({
            message: "Token verified",
            // user: { id: _id, name, email, type }
        });

    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Logout controller
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("authToken", { httpOnly: true });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

