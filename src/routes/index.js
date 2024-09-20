import { Router } from "express";
import authRouter from "./auth/auth.routes.js";
import paymentRouter from "./payments/payment.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/payment", paymentRouter);

export default router;
