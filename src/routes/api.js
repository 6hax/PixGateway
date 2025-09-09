import express from "express";
import { authMiddleware, limiter } from "#middlewares";
import {
    createPayment,
    getPayment,
    getPreference,
    checkApproved,
    cancelPayment,
    webhook
} from "#controllers";

const router = express.Router();


router.use(limiter);

router.post("/payment", authMiddleware, createPayment);
router.get("/payment/:id", authMiddleware, getPayment);
router.get("/preference/:id", authMiddleware, getPreference);
router.get("/check/all/:paymentId/:preferenceId", authMiddleware, checkApproved);
router.post("/cancel/:id", authMiddleware, cancelPayment);
router.post("/webhook", webhook);

export default router;
