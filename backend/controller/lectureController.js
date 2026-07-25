import { uploadOnCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";

/* ===========================================================
                    CREATE LECTURE
=========================================================== */

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureTitle } = req.body;
    const userId = req.userId || req.user?.id;

    if (!lectureTitle || lectureTitle.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required.",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Only course creator can create lectures
    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle: lectureTitle.trim(),
      course: course._id,
      creator: userId,
      order: course.lectures.length + 1,
    });

    course.lectures.push(lecture._id);
    course.totalLectures = course.lectures.length;

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully.",
      lecture,
    });
  } catch (error) {
    console.error("Create Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                GET ALL LECTURES OF A COURSE
=========================================================== */

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate({
      path: "lectures",
      options: {
        sort: {
          order: 1,
        },
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
      totalLectures: course.lectures.length,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("Get Course Lectures Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                    GET SINGLE LECTURE
=========================================================== */

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId)
      .populate("course", "title creator");

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });

  } catch (error) {
    console.error("Get Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                    UPDATE LECTURE
=========================================================== */

export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.userId || req.user?.id;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Only educator who owns course
    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const {
      lectureTitle,
      description,
      isPreviewFree,
      order,
      resources,
    } = req.body;

    if (lectureTitle !== undefined) {
      lecture.lectureTitle = lectureTitle.trim();
    }

    if (description !== undefined) {
      lecture.description = description.trim();
    }

    if (isPreviewFree !== undefined) {
      lecture.isPreviewFree = isPreviewFree;
    }

    if (order !== undefined) {
      lecture.order = Number(order);
    }

    if (resources !== undefined) {
      lecture.resources = resources;
    }

    /* ==========================================
            Upload / Replace Video
    ========================================== */

    if (req.file) {
      // Delete previous video
      if (lecture.videoPublicId) {
        await deleteFromCloudinary(
          lecture.videoPublicId,
          "video"
        );
      }

      const upload = await uploadOnCloudinary(
        req.file.path,
        "VirtualCourses/Lectures"
      );

      if (!upload.success) {
        return res.status(500).json({
          success: false,
          message: "Video upload failed.",
        });
      }

      lecture.videoUrl = upload.url;
      lecture.videoPublicId = upload.public_id;
      lecture.duration = upload.duration;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully.",
      lecture,
    });

  } catch (error) {
    console.error("Update Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================================
                    DELETE LECTURE
=========================================================== */

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.userId || req.user?.id;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Only course creator can delete
    if (course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    /* ==========================================
            Delete Cloudinary Video
    ========================================== */

    if (lecture.videoPublicId) {
      await deleteFromCloudinary(
        lecture.videoPublicId,
        "video"
      );
    }

    /* ==========================================
            Remove lecture from course
    ========================================== */

    course.lectures.pull(lecture._id);
    course.totalLectures = course.lectures.length;

    await course.save();

    /* ==========================================
            Delete lecture document
    ========================================== */

    await lecture.deleteOne();

    /* ==========================================
            Re-order remaining lectures
    ========================================== */

    const remainingLectures = await Lecture.find({
      course: course._id,
    }).sort({
      order: 1,
    });

    for (let i = 0; i < remainingLectures.length; i++) {
      remainingLectures[i].order = i + 1;
      await remainingLectures[i].save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};