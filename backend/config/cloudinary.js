import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ======================================================
// Cloudinary Configuration
// ======================================================

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.log("Cloudinary environment variables are missing.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================================================
// Upload File to Cloudinary
// ======================================================

export const uploadOnCloudinary = async (
  filePath,
  folder = "VirtualCourses"
) => {
  try {
    if (!filePath) {
      throw new Error("File path not found.");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    // Remove temporary uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      duration: result.duration || 0,
      bytes: result.bytes,
    };
  } catch (error) {
    console.log("Cloudinary Upload Error:", error.message);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: false,
      url: "",
      public_id: "",
      resource_type: "",
      duration: 0,
      bytes: 0,
    };
  }
};

// ======================================================
// Delete File From Cloudinary
// ======================================================

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return true;
  } catch (error) {
    console.log("Cloudinary Delete Error:", error.message);
    return false;
  }
};

export default uploadOnCloudinary;