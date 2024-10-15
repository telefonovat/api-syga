
import express from "express";
import cors from "cors";

import { config } from "./config";

import { router } from "./routes";

const app = express()
const port = 3000

app.use(cors());

app.use(router);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${port}`)
})
