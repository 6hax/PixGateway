import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPayment,
  getPayment,
  getPreference,
  checkApproved,
  cancelPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payment", authMiddleware, createPayment);
router.get("/payment/:id", authMiddleware, getPayment);
router.get("/preference/:id", authMiddleware, getPreference);
router.get("/check/:paymentId/:preferenceId", authMiddleware, checkApproved);
router.post("/cancel/:id", authMiddleware, cancelPayment);

export default router;
