import express from 'express';
import { addEvent, getAllEvents, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { uploadEvent } from "../multer/multerConfig.js";


export const eventRouter = express.Router();

eventRouter.post('/addEvent', uploadEvent.single('picture'), addEvent);

eventRouter.get("/getAllEvents", getAllEvents);

eventRouter.put("/updateEvent/:id", uploadEvent.single("picture"), updateEvent);

eventRouter.delete("/deleteEvent/:id", deleteEvent);
