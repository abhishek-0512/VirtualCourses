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

    let thumbnail = "";

    if (req.file) {
      const thumbnailUrl = await uploadOnCloudinary(req.file.path);

      if (!thumbnailUrl) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload thumbnail.",
        });
      }

      thumbnail = thumbnailUrl;
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
      message: "Failed to create course.",
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
      .populate("lectures reviews")
      .populate("creator", "name email photoUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get Published Courses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch published courses.",
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
      .populate("lectures")
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
      message: "Failed to fetch creator courses.",
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

    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course.",
      });
    }

    let {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    } = req.body;

    if (title) course.title = title.trim();
    if (subTitle) course.subTitle = subTitle.trim();
    if (description) course.description = description.trim();
    if (category) course.category = category.trim();
    if (level) course.level = level;

    if (price !== undefined) {
      course.price = Number(price);
    }

    if (typeof isPublished !== "undefined") {
      course.isPublished = isPublished;
    }

    if (req.file) {
      const thumbnailUrl = await uploadOnCloudinary(req.file.path);

      if (!thumbnailUrl) {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed.",
        });
      }

      course.thumbnail = thumbnailUrl;
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
      message: "Failed to update course.",
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
      .populate("lectures")
      .populate("creator", "name description email photoUrl");

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
    console.error("Get Course By Id Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course.",
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

    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course.",
      });
    }

    // Delete all lectures of this course
    await Lecture.deleteMany({
      course: course._id,
    });

    // Remove course from enrolled users
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

    await course.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Remove Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove course.",
    });
  }
};
/* ===========================================================
                    CREATE LECTURE
=========================================================== */

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    let { lectureTitle } = req.body;

    if (!lectureTitle || lectureTitle.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required.",
      });
    }

    lectureTitle = lectureTitle.trim();

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add lectures to this course.",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle,
      creator: req.userId,
      course: course._id,
    });

    course.lectures.push(lecture._id);
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
      message: "Failed to create lecture.",
    });
  }
};



/* ===========================================================
                GET COURSE LECTURES
=========================================================== */

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate({
        path: "lectures",
        options: {
          sort: {
            createdAt: 1,
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
      message: "Failed to fetch lectures.",
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
        success: false,
        message: "Lecture not found.",
      });
    }

    const course = await Course.findOne({
      lectures: lectureId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this lecture.",
      });
    }

    if (lectureTitle && lectureTitle.trim() !== "") {
      lecture.lectureTitle = lectureTitle.trim();
    }

    if (typeof isPreviewFree !== "undefined") {
      lecture.isPreviewFree = isPreviewFree;
    }

    if (req.file) {
      const videoUrl = await uploadOnCloudinary(req.file.path);

      if (!videoUrl) {
        return res.status(500).json({
          success: false,
          message: "Video upload failed.",
        });
      }

      lecture.videoUrl = videoUrl;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully.",
      lecture,
    });
  } catch (error) {
    console.error("Edit Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lecture.",
    });
  }
};



/* ===========================================================
                    REMOVE LECTURE
=========================================================== */

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    const course = await Course.findOne({
      lectures: lectureId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.creator.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove this lecture.",
      });
    }

    course.lectures.pull(lectureId);

    await course.save();

    await lecture.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully.",
    });
  } catch (error) {
    console.error("Remove Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lecture.",
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
      .select("-password -resetOtp -otpExpires -isOtpVerified");

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
      message: "Failed to fetch creator details.",
    });
  }
};