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

    let picturePath = '';
    if (req.file) {
      picturePath = `/uploads/events/${req.file.filename}`;
    } else if (req.body.picture) {
      picturePath = req.body.picture;
    }

    const newEvent = new Event({
      fullName, description, date: parsedDate, time, picture: picturePath, createdBy: req.user?.id || null
    });

    await newEvent.save();

    return res.status(200).json({ message: "Event created Successfully", newEvent });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message })
  }
}