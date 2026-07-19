import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";

/* ===========================================================
                    CREATE COURSE
=========================================================== */
export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message: "Title and Category are required",
      });
    }


    let thumbnail = "";


    if (req.file) {

      console.log("Uploading thumbnail...");

      const thumbnailUrl = await uploadOnCloudinary(req.file.path);

      console.log("Cloudinary URL:", thumbnailUrl);


      if (thumbnailUrl) {
        thumbnail = thumbnailUrl;
      }

    }


    const course = await Course.create({

      title,

      category,

      thumbnail,

      creator: req.userId,

    });


    return res.status(201).json(course);


  } catch (error) {

    console.log(error);


    return res.status(500).json({

      message: "Failed to create course",

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
    }).populate("lectures reviews");

    return res.status(200).json(courses);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch published courses",
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
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch creator courses",
    });
  }
};

/* ===========================================================
                    EDIT COURSE
=========================================================== */

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    course.title = title;
    course.subTitle = subTitle;
    course.description = description;
    course.category = category;
    course.level = level;
    course.price = price;
    course.isPublished = isPublished;

    // Upload thumbnail if a new file is selected
    if (req.file) {
      console.log("Uploading thumbnail...");
      console.log(req.file.path);

      const thumbnailUrl = await uploadOnCloudinary(req.file.path);

      console.log("Cloudinary URL:", thumbnailUrl);

      if (thumbnailUrl) {
        course.thumbnail = thumbnailUrl;
      }
    }

    await course.save();

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};

/* ===========================================================
                    GET COURSE BY ID
=========================================================== */

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch course",
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
        message: "Course not found",
      });
    }

    await course.deleteOne();

    return res.status(200).json({
      message: "Course removed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to remove course",
    });
  }
};
/* ===========================================================
                    CREATE LECTURE
=========================================================== */

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle,
    });

    course.lectures.push(lecture._id);

    await course.save();
    await course.populate("lectures");

    return res.status(201).json({
      lecture,
      course,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

/* ===========================================================
                GET COURSE LECTURES
=========================================================== */

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch lectures",
    });
  }
};

/* ===========================================================
                    EDIT LECTURE
=========================================================== */

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, isPreviewFree } = req.body;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }

    lecture.isPreviewFree = isPreviewFree;

    if (req.file) {
      console.log("Uploading lecture video...");

      const videoUrl = await uploadOnCloudinary(req.file.path);

      if (videoUrl) {
        lecture.videoUrl = videoUrl;
      }
    }

    await lecture.save();

    return res.status(200).json(lecture);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to edit lecture",
    });
  }
};

/* ===========================================================
                    REMOVE LECTURE
=========================================================== */

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    await Course.updateOne(
      {
        lectures: lectureId,
      },
      {
        $pull: {
          lectures: lectureId,
        },
      }
    );

    return res.status(200).json({
      message: "Lecture removed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};

/* ===========================================================
                    GET CREATOR DETAILS
=========================================================== */

export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch creator",
    });
  }
};