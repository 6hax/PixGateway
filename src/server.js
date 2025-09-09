import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import { env } from "./config/env.js";

const app = express();
app.use(bodyParser.json());
app.use(routes);

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
});
