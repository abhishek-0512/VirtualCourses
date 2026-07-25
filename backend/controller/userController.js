import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";

// ================= GET CURRENT USER =================

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Get current user error",
    });
  }
};

// ================= UPDATE PROFILE =================

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;

    const { name, description } = req.body;

    let photoUrl;

    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResult && cloudinaryResult.url) {
        photoUrl = cloudinaryResult.url;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        description,
        ...(photoUrl && { photoUrl }),
      },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: `Update Profile Error ${error.message}`,
    });
  }
};

// Alias export for lowercase route imports
export const updateProfile = UpdateProfile;