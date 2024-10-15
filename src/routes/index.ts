import { algorithmExecutor } from "src/controllers/algorithm/algorithm-executor";
import { router as algorithmExecuteRouter } from "./algorithm.execute.route";
import express from "express"

const router = express.Router();

router.use("/algorithm/execute", algorithmExecuteRouter);

export { router };
