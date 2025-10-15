import express from "express";
import { signupUser } from "../controllers/userController.js";
import { loginUser, verifyToken, logoutUser, updateProfile } from "../controllers/loginController.js";

export const userRouter = express.Router();

// Signup Route
userRouter.post("/signup", signupUser);

//Login Route
userRouter.post("/login", loginUser);

//verify Token
userRouter.get("/verifyToken", verifyToken);

//Logout user
userRouter.post("/logout", logoutUser);

//Update profile
userRouter.put("/updateProfile", updateProfile);
