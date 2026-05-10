import express from "express"
import { createOrder, verifyPayment, enrollFreeCourse } from "../controllers/orderController.js";


let paymentRouter = express.Router()

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify-payment", verifyPayment);
paymentRouter.post("/enroll-free", enrollFreeCourse);


export default paymentRouter