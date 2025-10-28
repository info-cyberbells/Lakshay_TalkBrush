import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import path from 'path';

import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoute.js";
import { eventRouter } from "./routes/eventRoutes.js";

dotenv.config();
const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use("/api/users", userRouter);
app.use("/api/event", eventRouter);

// Connect to DB
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
