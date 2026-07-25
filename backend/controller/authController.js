import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { genToken, setTokenCookie } from "../config/token.js";

// =======================
// GOOGLE AUTH / SIGNUP CONTROLLER
// =======================
export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, photoUrl, role } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Email and Google ID are required.",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google ID if user registered with password previously
      if (!user.googleId) {
        user.googleId = googleId;
        if (photoUrl && !user.photoUrl) user.photoUrl = photoUrl;
        await user.save();
      }
    } else {
      // Create new user via Google
      user = await User.create({
        name: name || "Google User",
        email,
        googleId,
        photoUrl: photoUrl || "",
        role: role || "student",
      });
    }

    // Generate JWT token & set cookie
    const token = genToken(user._id);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during Google authentication.",
      error: error.message,
    });
  }
};

// Alias export in case authRoute.js imports googleSignup
export const googleSignup = googleAuth;

// =======================
// SIGN UP CONTROLLER
// =======================
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    const token = genToken(newUser._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

// =======================
// LOGIN CONTROLLER
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = genToken(user._id);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
};

// =======================
// GET CURRENT USER CONTROLLER
// =======================
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const user = await User.findById(userId).populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile.",
      error: error.message,
    });
  }
};

// =======================
// LOGOUT CONTROLLER
// =======================
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout.",
      error: error.message,
    });
  }
};

// Alias export in case authRoute.js imports 'logout' instead of 'logOut'
export const logout = logOut;