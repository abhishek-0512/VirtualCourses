import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

import Course from "../model/courseModel.js";
import User from "../model/userModel.js";

/* ===========================================================
                    CREATE COURSE
=========================================================== */

export const createCourse = async (req, res) => {
  try {
    let { title, category } = req.body;

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
      creator: req.userId,
    };

    if (req.file) {
      const thumbnail = await uploadOnCloudinary(req.file.path);

      courseData.thumbnail = thumbnail.secure_url;
      courseData.thumbnailPublicId = thumbnail.public_id;
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
    const courses = await Course.find({
      creator: req.userId,
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

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== req.userId) {
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

      course.thumbnail = thumbnail.secure_url;
      course.thumbnailPublicId = thumbnail.public_id;
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

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== req.userId) {
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