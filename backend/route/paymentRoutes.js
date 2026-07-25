import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createOrder, verifyPayment } from "../controller/orderController.js";

const paymentRouter = express.Router();

// Require authentication before creating orders or verifying payments
paymentRouter.post("/create-order", isAuth, createOrder);
paymentRouter.post("/verify-payment", isAuth, verifyPayment);

export default paymentRouter;