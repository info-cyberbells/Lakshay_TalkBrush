import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Event from '../models/eventModel.js';

// Ensure upload folder exists
const uploadFolder = path.join(process.cwd(), 'uploads/events');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

// File filter: only JPG and PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG and PNG images are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// add new event
export const addEvent = async (req, res) => {
  try {
    const { fullName, description, date, time } = req.body;

    if (!fullName || !description || !date || !time) {
      return res.status(400).json({ message: 'All feilds are Required' })
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" })
    }

    let picturePaths = [];
    if (req.file) {
      picturePaths.push(`/uploads/events/${req.file.filename}`);
    } else if (req.body.pictures && Array.isArray(req.body.pictures)) {
      for (const pictureData of req.body.pictures) {
        if (pictureData.startsWith('data:image')) {
          const base64Data = pictureData.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
          const filepath = path.join(uploadFolder, filename);
          fs.writeFileSync(filepath, buffer);
          picturePaths.push(`/uploads/events/${filename}`);
        }
      }
    }

    const newEvent = new Event({
      fullName, description, date: parsedDate, time,
      pictures: picturePaths,
      createdBy: req.user?.id || null
    });

    await newEvent.save();


    return res.status(200).json({ message: "Event created Successfully", newEvent });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message })
  }
}


// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayEvents = await Event.find({
      date: { $gte: todayStart, $lte: todayEnd },
    }).sort({ time: 1 });

    const events = await Event.find({
      date: { $not: { $gte: todayStart, $lte: todayEnd } },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments({
      date: { $not: { $gte: todayStart, $lte: todayEnd } },
    });

    const host = `${req.protocol}://${req.get('host')}`;
    const mapEventPictures = (arr) =>
      arr.map(event => ({
        ...event._doc,
        pictures: event.pictures && event.pictures.length > 0
          ? event.pictures.map(pic => host + pic)
          : [],
      }));

    return res.status(200).json({
      todayEvents,
      events: mapEventPictures(events),
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Update an event by ID
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, description, date, time } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (fullName) event.fullName = fullName;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;

    let picturePaths = event.pictures || [];

    if (req.body.pictures && Array.isArray(req.body.pictures)) {
      picturePaths = [];

      for (let pic of req.body.pictures) {

        if (pic.startsWith("http://") || pic.startsWith("https://")) {
          const relative = pic.replace(/^https?:\/\/[^/]+/, "");
          picturePaths.push(relative);
          continue;
        }

        if (pic.startsWith("/uploads/")) {
          picturePaths.push(pic);
          continue;
        }

        if (pic.startsWith("data:image")) {
          const base64Data = pic.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
          const filepath = path.join(uploadFolder, filename);

          fs.writeFileSync(filepath, buffer);

          picturePaths.push(`/uploads/events/${filename}`);
          continue;
        }

      }
    }

    event.pictures = picturePaths;

    await event.save();

    return res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.pictures && Array.isArray(event.pictures)) {
      event.pictures.forEach(picturePath => {
        const fullPath = path.join(process.cwd(), picturePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    await Event.findByIdAndDelete(id);
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};