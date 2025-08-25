import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPayment,
  getPayment,
  getPreference,
  checkApproved,
  cancelPayment,
} from "#controllers";

const router = express.Router();

router.post("/payment", authMiddleware, createPayment);

router.get("/payment/:id", authMiddleware, getPayment);
router.get("/preference/:id", authMiddleware, getPreference);

// router.get("/check/payment/:paymentId", authMiddleware, _); // soon
// router.get("/check/preference/:preferenceId", authMiddleware, _); // soon
router.get("/check/all/:paymentId/:preferenceId", authMiddleware, checkApproved);

router.post("/cancel/:id", authMiddleware, cancelPayment);

// router.post("/webhook", _) // soon

export default router;
