import Course from "../model/courseModel.js";
import Razorpay from "razorpay";
import User from "../model/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are required");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: courseId.toString(),
    };

    const razorpayInstance = getRazorpayInstance();

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json(order);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: `Order creation failed ${err.message}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, courseId, userId: bodyUserId } = req.body;

    const userId = bodyUserId || req.userId || req.user?.id;

    const razorpayInstance = getRazorpayInstance();

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const user = await User.findById(userId);

      if (user && !user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId);

      if (course && !course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({
        message: "Payment verified and enrollment successful",
      });
    } else {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error during payment verification",
    });
  }
};