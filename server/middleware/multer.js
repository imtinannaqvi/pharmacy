import multer from "multer";
import path from "path";
import fs from "fs";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    
    // Create folder if it doesn't exist to prevent ENOENT errors
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generates a unique filename using the current timestamp
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;