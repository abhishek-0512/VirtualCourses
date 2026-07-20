import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
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
        message: "Title and category are required.",
      });
    }

    title = title.trim();
    category = category.trim();

    const existingCourse = await Course.findOne({
      title,
      creator: req.userId,
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exists.",
      });
    }

    let thumbnail = "";

    if (req.file) {
      const upload = await uploadOnCloudinary(
        req.file.path,
        "VirtualCourses/CourseThumbnails"
      );

      if (!upload.success) {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed.",
        });
      }

      thumbnail = upload.url;
    }

    const course = await Course.create({
      title,
      category,
      thumbnail,
      creator: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course,
    });

  } catch (error) {

    console.error("Create Course Error:", error);

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

    const courses = await Course.find({
      isPublished: true,
    })
      .populate({
        path: "creator",
        select: "name email photoUrl description",
      })
      .populate({
        path: "lectures",
        options: {
          sort: {
            order: 1,
          },
        },
      })
      .populate("reviews")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });

  } catch (error) {

    console.error("Published Courses Error:", error);

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
    })
      .populate({
        path: "lectures",
        options: {
          sort: {
            order: 1,
          },
        },
      })
      .populate("reviews")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });

  } catch (error) {

    console.error("Get Creator Courses Error:", error);

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
      .populate({
        path: "creator",
        select: "name email photoUrl description",
      })
      .populate({
        path: "lectures",
        options: {
          sort: {
            order: 1,
          },
        },
      })
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
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });

  } catch (error) {

    console.error("Get Course By ID Error:", error);

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
        message: "Course not found.",
      });
    }

    // Only creator can edit the course
    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
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

    /* ==========================
            Update Fields
    ========================== */

    if (title !== undefined) {
      course.title = title.trim();
    }

    if (subTitle !== undefined) {
      course.subTitle = subTitle.trim();
    }

    if (description !== undefined) {
      course.description = description.trim();
    }

    if (category !== undefined) {
      course.category = category.trim();
    }

    if (level !== undefined) {
      course.level = level;
    }

    if (price !== undefined) {
      course.price = Number(price);
    }

    if (isPublished !== undefined) {
      course.isPublished = isPublished;
    }

    /* ==========================
        Replace Thumbnail
    ========================== */

    if (req.file) {
      // Delete old thumbnail if stored in Cloudinary
      if (
        course.thumbnail &&
        course.thumbnail.includes("cloudinary")
      ) {
        try {
          const parts = course.thumbnail.split("/");
          const fileName = parts[parts.length - 1];
          const publicId =
            "VirtualCourses/CourseThumbnails/" +
            fileName.substring(0, fileName.lastIndexOf("."));

          await deleteFromCloudinary(publicId, "image");
        } catch (error) {
          console.log("Old thumbnail deletion skipped.");
        }
      }

      const upload = await uploadOnCloudinary(
        req.file.path,
        "VirtualCourses/CourseThumbnails"
      );

      if (!upload.success) {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed.",
        });
      }

      course.thumbnail = upload.url;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course,
    });

  } catch (error) {

    console.error("Edit Course Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
/* ===========================================================
                    REMOVE COURSE
=========================================================== */

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Only creator can delete
    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    /* =====================================
        Delete all lecture videos
    ===================================== */

    const lectures = await Lecture.find({
      course: course._id,
    });

    for (const lecture of lectures) {
      if (lecture.videoPublicId) {
        await deleteFromCloudinary(
          lecture.videoPublicId,
          "video"
        );
      }
    }

    /* =====================================
        Delete course thumbnail
    ===================================== */

    if (
      course.thumbnail &&
      course.thumbnail.includes("cloudinary")
    ) {
      try {
        const parts = course.thumbnail.split("/");
        const fileName = parts[parts.length - 1];

        const publicId =
          "VirtualCourses/CourseThumbnails/" +
          fileName.substring(0, fileName.lastIndexOf("."));

        await deleteFromCloudinary(
          publicId,
          "image"
        );

      } catch (error) {
        console.log("Thumbnail deletion skipped.");
      }
    }

    /* =====================================
        Delete all lectures
    ===================================== */

    await Lecture.deleteMany({
      course: course._id,
    });

    /* =====================================
        Remove course from enrolled students
    ===================================== */

    await User.updateMany(
      {
        enrolledCourses: course._id,
      },
      {
        $pull: {
          enrolledCourses: course._id,
        },
      }
    );

    /* =====================================
        Delete course
    ===================================== */

    await course.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });

  } catch (error) {

    console.error("Delete Course Error:", error);

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

    const creator = await User.findById(userId)
      .select(
        "-password -resetOtp -otpExpires -isOtpVerified"
      );

    if (!creator) {

      return res.status(404).json({
        success: false,
        message: "Creator not found.",
      });

    }

    return res.status(200).json({
      success: true,
      creator,
    });

  } catch (error) {

    console.error("Get Creator Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
