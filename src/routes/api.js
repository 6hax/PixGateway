import express from "express";
import { authMiddleware, limiter } from "#middlewares";
import {
    createPayment,
    getPayment,
    getPreference,
    cancelPayment,
    webhook,
    check
} from "#controllers";

const router = express.Router();

router.use(limiter);

router.get("/payment/:id", authMiddleware, getPayment);
router.get("/preference/:id", authMiddleware, getPreference);

router.post("/payment", authMiddleware, createPayment);
router.post("/check", authMiddleware, check);
router.post("/cancel/:id", authMiddleware, cancelPayment);
router.post("/webhook", webhook);

export default router;