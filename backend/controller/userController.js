import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";

// ================= GET CURRENT USER / PROFILE =================

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Fallback if avatar URL is broken/using offline provider
    if (!user.photoUrl || user.photoUrl.includes("avatar.iran.liara.run")) {
      user.photoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.name || "User"
      )}`;
    }

    return res.status(200).json({
      success: true,
      user,
      ...user.toObject(), // Ensures compatibility whether frontend checks res.data.user or res.data
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: `Get current user error: ${error.message}`,
    });
  }
};

// Alias export for alternate controller naming
export const getUserProfile = getCurrentUser;

// ================= UPDATE PROFILE =================

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    const { name, description } = req.body;

    let photoUrl;

    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResult && (cloudinaryResult.secure_url || cloudinaryResult.url)) {
        photoUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(photoUrl && { photoUrl }),
      },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      ...updatedUser.toObject(),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: `Update Profile Error: ${error.message}`,
    });
  }
};

// Alias exports for lowercase/varied route imports
export const updateProfile = UpdateProfile;