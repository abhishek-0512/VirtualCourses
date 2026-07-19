import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./route/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./paymentRoutes.js";
import aiRouter from "./route/aiRoutes.js";
import reviewRouter from "./route/reviewRoute.js";

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);


app.get("/", (req, res) => {
    res.send("Hello From Server");
});


app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
    connectDb();
});