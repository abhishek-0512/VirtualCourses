import User from "../model/userModel.js";

const isEducator = async (req, res, next) => {
  try {
    const userId = req.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Only educator can access this route",
      });
    }

    next();
  } catch (error) {
    console.log("Educator Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { isEducator };
export default isEducator;