
import express from "express";
import cors from "cors";

import { config } from "./config";

import { router } from "./routes";

const app = express()

app.use(cors());

app.use(router);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
