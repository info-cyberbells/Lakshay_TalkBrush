import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
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
            fullName = fullName
                .trim()
                .split(" ")
                .filter(word => word.length > 0)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
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


//change password
export const changePassword = async (req, res) => {
    try {
        const token = req.cookies?.authToken;
        const { currentPassword, newPassword } = req.body;

        if (!token || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const requestResetPassword = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email."
            });
        }

        if (user) {
            const resetCode = Math.floor(1000 + Math.random() * 9000).toString();


            user.resetCode = resetCode;
            user.resetCodeExpires = Date.now() + 3600000;
            await user.save();


            await sendResetEmail(email, resetCode);


            return res.status(200).json({
                message: 'A 4-digit reset code has been sent to your email.',

                // code: resetCode
            });
        }


        res.status(404).json({ message: 'No account found with this email.' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const sendResetEmail = async (email, resetCode) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"TalkBrush" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password – TalkBrush",
        html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
      <style>
        body {
          font-family: 'Poppins', Arial, sans-serif;
          background: #f7f9fb;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .wrapper {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc);
          color: white;
          text-align: center;
          padding: 35px 20px;
        }
        .header h1 {
          font-size: 26px;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 20px;
          color: #555;
        }
        .code-box {
          display: inline-block;
          background: #f1f5ff;
          border: 2px dashed #2d4cca;
          border-radius: 10px;
          padding: 20px 40px;
          margin: 20px 0;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #2d4cca;
        }
        .button {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 30px;
          background: #2d4cca;
          color: white;
          font-weight: 600;
          text-decoration: none;
          border-radius: 8px;
          transition: 0.3s;
        }
        .button:hover {
          background: #1e38a3;
        }
        .footer {
          background: #f0f3f8;
          text-align: center;
          padding: 20px;
          font-size: 13px;
          color: #666;
        }
        .footer a {
          color: #2d4cca;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>TalkBrush Password Reset</h1>
        </div>
        <div class="content">
          <p>Hi there</p>
          <p>
            You recently requested to reset your password for your TalkBrush account.
            Use the 4-digit code below to complete the process.
          </p>

          <div class="code-box">
            <span class="code">${resetCode}</span>
          </div>

          <p>
            This code will expire in <strong>1 hour</strong>.<br />
            If you didn’t request this, you can safely ignore this email.
          </p>

        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TalkBrush. All rights reserved.</p>
          <p>Need help? Contact us at <a href="mailto:talkbrush2025@gmail.com">talkbrush2025@gmail.com</a></p>
        </div>
      </div>
    </body>
    </html>
    `,
    };

    await transporter.sendMail(mailOptions);
};



export const verifyResetCodeAndChangePassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        const user = await User.findOne({
            email,
            resetCode: code,
            resetCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset code.'
            });
        }

        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({
                message: 'New password cannot be the same as your current password. Please choose a different password.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);


        user.resetCode = undefined;
        user.resetCodeExpires = undefined;

        await user.save();

        res.status(200).json({
            message: 'Password updated successfully. You can now log in.'
        });
    } catch (error) {
        console.error('Error verifying code and changing password:', error);
        res.status(500).json({
            message: 'Server error. Please try again later.'
        });
    }
};

