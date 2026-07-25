import Course from "../model/courseModel.js";
import Razorpay from "razorpay";
import User from "../model/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({ key_id, key_secret });
};

/* ===========================================================
                    CREATE ORDER
=========================================================== */
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const razorpayInstance = getRazorpayInstance();

    // Dev Fallback: If Razorpay keys are not provided in backend/.env
    if (!razorpayInstance) {
      console.warn("⚠️ Razorpay keys missing in .env. Enrolling user directly for testing.");

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { enrolledCourses: courseId },
        });
        await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId },
        });
      }

      return res.status(200).json({
        success: true,
        isFree: true,
        message: "Razorpay keys missing in .env. Granted test enrollment automatically!",
      });
    }

    const price = course.price ?? course.coursePrice ?? 0;

    const options = {
      amount: Math.round(price * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${courseId.slice(-6)}_${Date.now().toString().slice(-6)}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      amount: order.amount,
      currency: order.currency,
      id: order.id,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Order creation error:", err);

    return res.status(500).json({
      success: false,
      message: `Order creation failed: ${err.message}`,
    });
  }
};

/* ===========================================================
                    VERIFY PAYMENT
=========================================================== */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, courseId, userId: bodyUserId } = req.body;

    const userId = bodyUserId || req.userId || req.user?.id || req.user?._id;

    const razorpayInstance = getRazorpayInstance();

    // If test mode (no keys configured)
    if (!razorpayInstance) {
      if (userId && courseId) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { enrolledCourses: courseId },
        });
        await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Enrolled successfully in test mode!",
      });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid" || orderInfo.status === "created") {
      if (userId) {
        const user = await User.findById(userId);
        if (user && !user.enrolledCourses.includes(courseId)) {
          user.enrolledCourses.push(courseId);
          await user.save();
        }
      }

      if (courseId) {
        const course = await Course.findById(courseId);
        if (course && userId && !course.enrolledStudents.includes(userId)) {
          course.enrolledStudents.push(userId);
          await course.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and enrollment successful",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
    });
  }
};