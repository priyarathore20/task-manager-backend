import { Router } from "express";
import authRouter from "./auth/auth.routes.js";
import tasksRouter from "./tasks/tasks.routes.js";

const router = Router();

router.use("/api/tasks", tasksRouter);
router.use("/api/auth", authRouter);

export default router;
