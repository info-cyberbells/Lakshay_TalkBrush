import express from "express";
import { getDashboardOverview, getUserDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/overview", getDashboardOverview);

router.get("/student-overview", getUserDashboard);

export const dashboardRouter = router;
