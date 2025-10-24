import express from 'express';
import { upload, addEvent } from '../controllers/eventController.js';
import { verifyToken } from '../controllers/loginController.js';

export const eventRouter = express.Router();

eventRouter.post('/addEvent', upload.single('picture'), addEvent);
