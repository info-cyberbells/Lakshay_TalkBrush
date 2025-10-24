import express from "express";
import { signupUser, getUsersByType, updateProfile, updateUser, deleteUser } from "../controllers/userController.js";
import { loginUser, verifyToken, logoutUser } from "../controllers/loginController.js";

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
userRouter.put("/updateProfile", updateProfile);

//update user
userRouter.put("/editUser/:id", updateUser);

//delete Users/user
userRouter.delete("/deleteUsers", deleteUser);



