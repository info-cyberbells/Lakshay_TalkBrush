import express from "express";
import { getType3Analytics } from "../controllers/AnalysisController.js";

const router = express.Router();

router.get("/type3", getType3Analytics);

export default router;