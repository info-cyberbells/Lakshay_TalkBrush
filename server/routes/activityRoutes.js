import express from "express";
import { getActivities } from "../controllers/activityController.js";

const router = express.Router();

router.get("/getAllActivities", getActivities);

export default router;
