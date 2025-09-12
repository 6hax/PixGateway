import express from "express";
import apiRouter from "./api.js";
import mainRouter from "./main.js";

const router = express.Router();

router.use("/api", apiRouter);
router.use("/", mainRouter);

export default router;






