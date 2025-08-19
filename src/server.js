import express from "express";
import bodyParser from "body-parser";
import paymentRoutes from "./routes/paymentRoutes.js";
import { env } from "./config/env.js";

const app = express();
app.use(bodyParser.json());

app.use("/api", paymentRoutes);

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
});
