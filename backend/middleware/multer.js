import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure 'uploads' directory exists
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    // Sanitize file name to prevent URL path issues
    const safeName = file.originalname.replace(/[^a-zA-Z0-0.-]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/mkv",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, WEBP, GIF, MP4, WEBM, and MKV are allowed."
      ),
      false
    );
  }
};

// Multer Middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit for course lectures
  },
  fileFilter,
});

export { upload };
export default upload;