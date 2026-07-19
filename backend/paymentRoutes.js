import express from "express"
import { createOrder, verifyPayment } from "./controller/orderController.js";

let paymentRouter = express.Router()

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify-payment", verifyPayment);

export default paymentRouter