import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import mongoSanitize from "express-mongo-sanitize";

import connectDb from "./config/db.js";

import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./paymentRoutes.js";
import aiRouter from "./route/aiRoutes.js";
import reviewRouter from "./route/reviewRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

/* ===========================
        Security Middleware
=========================== */

app.use(helmet());

// Uncomment if you decide to use it later
// app.use(mongoSanitize());

app.use(morgan("dev"));

/* ===========================
        Body Parser
=========================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===========================
            CORS
=========================== */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

/* ===========================
            Routes
=========================== */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Virtual Courses API is running 🚀",
  });
});

/* ===========================
        404 Handler
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===========================
    Global Error Handler
=========================== */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ===========================
        Start Server
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