import express from "express";
import { saveDeviceToken, removeDeviceToken } from "../controllers/notificationController.js";

const router = express.Router();

router.post('/save-token', saveDeviceToken);
router.post('/remove-token', removeDeviceToken);

export const notificationRoutes = router;
