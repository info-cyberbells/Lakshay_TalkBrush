import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import path from 'path';
import { startNotificationJob } from './notification.js';
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoute.js";
import { eventRouter } from "./routes/eventRoutes.js";
import { dashboardRouter } from "./routes/dashboardRoute.js";
import activityRoutes from "./routes/activityRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";

import { activityMiddleware } from "./utils/activityMiddelware.js";


dotenv.config();
const app = express();
app.set('trust proxy', true);
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));



// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(activityMiddleware);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use("/api/users", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/activities", activityRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/accent", roomRoutes);
app.use("/api/notifications", notificationRoutes);


connectDB();
startNotificationJob();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
