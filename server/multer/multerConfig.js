import path from "path";
import fs from "fs";
import multer from "multer";

// -------- Helper: Create folder if not exists --------
const ensureFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// -------- Base Filter for JPG & PNG --------
const imageFileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only JPG and PNG images allowed!"), false);
    }
    cb(null, true);
};

// -------- Function to generate storage config --------
const createStorage = (folderName) => {
    const folderPath = path.join(process.cwd(), `uploads/${folderName}`);
    ensureFolder(folderPath);

    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, folderPath),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
            cb(null, `${Date.now()}-${base}${ext}`);
        },
    });
};

// --------- EXPORT TWO MULTER INSTANCES ---------

// Event Upload (uploads/events)
export const uploadEvent = multer({
    storage: createStorage("events"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Profile Upload (uploads/profile)
export const uploadProfile = multer({
    storage: createStorage("profile"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
