import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// User Signup Controller
export const signupUser = async (req, res) => {
    try {
        let { fullName, email, password, phoneNumber, location, type } = req.body; 4

        if (fullName) {
            fullName = fullName.trim();
            fullName = fullName.charAt(0).toUpperCase() + fullName.slice(1).toLowerCase();
        }

        if (email) {
            email = email.trim().toLowerCase();
        }

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


//get current loged in user data
export const getProfile = async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return only the needed fields
        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                type: user.type,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error("Get Profile failed: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//update user data
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        let { fullName, email, phoneNumber, location, type, password } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fullName) {
            fullName = fullName.trim();
            fullName = fullName.charAt(0).toUpperCase() + fullName.slice(1).toLowerCase();
            user.fullName = fullName;
        }

        if (email) {
            email = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use by another user" });
            }
            user.email = email;
        }

        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (location) user.location = location;
        if (type) user.type = type;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                location: user.location,
                type: user.type,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Multiple Users /Single user
export const deleteUser = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of user IDs

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Please provide an array of user IDs" });
        }

        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            return res.status(400).json({ message: "No valid IDs provided" });
        }
        const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));

        const result = await User.deleteMany({ _id: { $in: objectIds } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No users found with the provided IDs" });
        }

        res.status(200).json({ message: `${result.deletedCount} user(s) deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


