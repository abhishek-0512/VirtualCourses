import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import mongoose from "mongoose";
import Course from "../model/courseModel.js";
import User from "../model/userModel.js";

/* ===========================================================
                    CREATE COURSE
=========================================================== */

export const createCourse = async (req, res) => {
  try {
    let { title, category } = req.body;

    const userId = req.userId || req.user?.id || req.user?._id;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    title = title.trim();
    category = category.trim();

    const courseData = {
      title,
      category,
      creator: userId,
    };

    if (req.file) {
      const thumbnail = await uploadOnCloudinary(req.file.path);

      if (thumbnail && thumbnail.url) {
        courseData.thumbnail = thumbnail.url;
        courseData.thumbnailPublicId = thumbnail.public_id;
      }
    }

    const course = await Course.create(courseData);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                GET ALL PUBLISHED COURSES
=========================================================== */

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("creator", "name photoUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                GET CREATOR COURSES
=========================================================== */

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    const courses = await Course.find({
      creator: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                GET COURSE BY ID
=========================================================== */

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("creator", "name photoUrl description")
      .populate("lectures")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name photoUrl",
        },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                    EDIT COURSE
=========================================================== */

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId || req.user?.id || req.user?._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    } = req.body;

    if (title) course.title = title;
    if (subTitle) course.subTitle = subTitle;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (isPublished !== undefined) course.isPublished = isPublished;

    if (req.file) {
      if (course.thumbnailPublicId) {
        await deleteFromCloudinary(course.thumbnailPublicId);
      }

      const thumbnail = await uploadOnCloudinary(req.file.path);

      if (thumbnail && thumbnail.url) {
        course.thumbnail = thumbnail.url;
        course.thumbnailPublicId = thumbnail.public_id;
      }
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                    DELETE COURSE
=========================================================== */

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId || req.user?.id || req.user?._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (course.thumbnailPublicId) {
      await deleteFromCloudinary(course.thumbnailPublicId);
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                GET CREATOR DETAILS
=========================================================== */

export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.params;

    const creator = await User.findById(userId).select("-password");

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    return res.status(200).json({
      success: true,
      creator,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
            TOGGLE LECTURE COMPLETION FOR USER
=========================================================== */

export const toggleLectureCompletion = async (req, res) => {
  try {
    const { lectureId } = req.body;
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: "Lecture ID is required",
      });
    }

    // Safely extract string ID whether passed as raw string, object with _id, or Mongoose ObjectId
    let targetIdStr = "";
    if (typeof lectureId === "string") {
      targetIdStr = lectureId;
    } else if (lectureId?._id) {
      targetIdStr = lectureId._id.toString();
    } else if (typeof lectureId?.toString === "function") {
      targetIdStr = lectureId.toString();
    }

    if (!targetIdStr || !mongoose.Types.ObjectId.isValid(targetIdStr)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure array is initialized
    if (!Array.isArray(user.completedLectures)) {
      user.completedLectures = [];
    }

    const isCompleted = user.completedLectures.some(
      (id) => id && id.toString() === targetIdStr
    );

    if (isCompleted) {
      user.completedLectures = user.completedLectures.filter(
        (id) => id && id.toString() !== targetIdStr
      );
    } else {
      user.completedLectures.push(targetIdStr);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isCompleted ? "Marked as incomplete" : "Lecture completed!",
      completedLectures: user.completedLectures,
    });
  } catch (error) {
    console.error("Critical Toggle Completion Crash:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating lecture completion",
    });
  }
};