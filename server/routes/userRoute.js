import express from "express";
import { signupUser, getUsersByType, updateProfile, getProfile, updateUser, deleteUser, changePassword, requestResetPassword, verifyResetCodeAndChangePassword } from "../controllers/userController.js";
import { loginUser, verifyToken, logoutUser } from "../controllers/loginController.js";
import { uploadProfile } from "../multer/multerConfig.js";

export const userRouter = express.Router();

// Signup Route
userRouter.post("/signup", signupUser);

//Login Route
userRouter.post("/login", loginUser);

//verify Token
userRouter.get("/verifyToken", verifyToken);

//Logout user
userRouter.post("/logout", logoutUser);

//get all users by type
userRouter.get("/getAllUsersByType", getUsersByType);

//Update profile
userRouter.put("/updateProfile", uploadProfile.single("image"), updateProfile);

//get logged in user data
userRouter.get("/profile", getProfile);

//update user
userRouter.put("/editUser/:id", updateUser);

//delete Users/user
userRouter.delete("/deleteUsers", deleteUser);

//change password 
userRouter.post("/changePassword", changePassword);

//request password reset
userRouter.post('/resetPassword', requestResetPassword);

//verify  password reset code and change password
userRouter.post('/verifyResetCode', verifyResetCodeAndChangePassword);


