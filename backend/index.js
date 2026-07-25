import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDb from "./config/db.js";

import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import lectureRouter from "./route/lectureRoute.js";
import aiRouter from "./route/aiRoutes.js";
import reviewRouter from "./route/reviewRoute.js";
import paymentRouter from "./route/paymentRoutes.js"; // or ./route/paymentRoutes.js if moved

const app = express();
const PORT = process.env.PORT || 8000;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===========================
        SECURITY & LOGGING
=========================== */

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows static file loading (e.g. images) across ports
  })
);
app.use(morgan("dev"));

/* ===========================
        BODY PARSER
=========================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===========================
        STATIC FILES
=========================== */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===========================
            CORS
=========================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* ===========================
            ROUTES
=========================== */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/lecture", lectureRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/payment", paymentRouter);

/* ===========================
            HOME
=========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Virtual Courses API is running 🚀",
  });
});

/* ===========================
            404
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===========================
        GLOBAL ERROR
=========================== */

app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

/* ===========================
        START SERVER
=========================== */

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();