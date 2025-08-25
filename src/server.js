import express from "express";
import bodyParser from "body-parser";
import paymentRoutes from "./routes/routes.js";
import { env } from "./config/env.js";
import { limiter } from "#middlewares";

const app = express();
app.use(bodyParser.json());
app.use(limiter);
app.use("/api", paymentRoutes);

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
});
