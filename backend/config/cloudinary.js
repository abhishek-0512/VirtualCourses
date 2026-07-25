import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ======================================================
// Cloudinary Configuration
// ======================================================

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn("⚠️ Warning: Cloudinary environment variables are missing or incomplete.");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Safely removes a temporary file from local storage
 * @param {string} filePath 
 */
const removeLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to remove temp file ${filePath}:`, err.message);
  }
};

// ======================================================
// Upload File to Cloudinary
// ======================================================

export const uploadOnCloudinary = async (filePath, folder = "VirtualCourses") => {
  try {
    if (!filePath) {
      throw new Error("Local file path is required for upload.");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    // Remove local temp file after successful upload
    removeLocalFile(filePath);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      duration: result.duration || 0,
      bytes: result.bytes || 0,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);

    // Ensure temp file is removed even if upload fails
    removeLocalFile(filePath);

    return {
      success: false,
      url: "",
      public_id: "",
      resource_type: "",
      duration: 0,
      bytes: 0,
      error: error.message,
    };
  }
};

// ======================================================
// Delete File From Cloudinary
// ======================================================

export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    return false;
  }
};

export default uploadOnCloudinary;