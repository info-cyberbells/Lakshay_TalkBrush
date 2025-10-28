import express from 'express';
import { upload, addEvent, getAllEvents, updateEvent, deleteEvent } from '../controllers/eventController.js';

export const eventRouter = express.Router();

eventRouter.post('/addEvent', upload.single('picture'), addEvent);

eventRouter.get("/getAllEvents", getAllEvents);

eventRouter.put("/updateEvent/:id", upload.single("picture"), updateEvent);

eventRouter.delete("/deleteEvent/:id", deleteEvent);
