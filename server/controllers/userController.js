import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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


// Get all users filtered by type
// export const getUsersByType = async (req, res) => {
//     try {
//         const { type } = req.query; 

//         if (!type) {
//             return res.status(400).json({ message: "Type is required" });
//         }

//         const users = await User.find({ type });

//         if (users.length === 0) {
//             return res.status(404).json({ message: "No users found for this type" });
//         }

//         res.status(200).json({
//             message: `Users fetched successfully for type ${type}`,
//             count: users.length,
//             users,
//         });
//     } catch (error) {
//         console.error("Error fetching users by type:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// Get all users filtered by type with pagination and sorting
export const getUsersByType = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ message: "Type is required" });
        }

        // Get parameters from frontend (with defaults)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';

        const skip = (page - 1) * limit;

        // Sort options
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        // Get total count
        const totalUsers = await User.countDocuments({ type });

        // Fetch users
        const users = await User.find({ type })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-password');

        res.status(200).json({
            message: "Users fetched successfully",
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



//Update profile 
export const updateProfile = async (req, res) => {
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

        const { fullName, email, phoneNumber } = req.body;

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        res.json({
            message: "Profile updated successfully", user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        })
    } catch (error) {
        console.error("Update Profile failed: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


