import express from "express";
import path from "path";

const router = express.Router();


router.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(process.cwd(), "public") });
});

export default router;
