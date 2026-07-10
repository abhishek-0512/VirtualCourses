import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDb from "./config/connectDb.js";
import authRouter from "./route/authRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Connect DB
connectDb();

// Start Server
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});