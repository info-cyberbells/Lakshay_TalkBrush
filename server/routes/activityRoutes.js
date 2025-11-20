import express from "express";
import { getActivities, getUserActivities } from "../controllers/activityController.js";

const router = express.Router();

router.get("/getAllActivities", getActivities);

router.get("/getUserActivities", getUserActivities);

export default router;