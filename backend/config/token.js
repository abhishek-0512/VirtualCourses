import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for a given user ID
 * @param {string} userId - User MongoDB ObjectId
 * @returns {string} - Signed JWT Token
 */
export const genToken = (userId) => {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const token = jwt.sign(
      {
        id: userId,
        userId: userId, // Provided for backwards compatibility
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return token;
  } catch (error) {
    console.error("JWT Token Generation Error:", error.message);
    throw new Error("Failed to generate authentication token");
  }
};

/**
 * Verify a JWT token
 * @param {string} token - JWT Token string
 * @returns {object} - Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("JWT Token Verification Error:", error.message);
    throw new Error("Invalid or expired token");
  }
};

/**
 * Set token as HTTP-Only Cookie on response object
 * @param {object} res - Express response object
 * @param {string} token - Signed JWT
 */
export const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};