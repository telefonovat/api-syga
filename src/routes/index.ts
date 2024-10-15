import { algorithmExecutor } from "src/controllers/algorithm/algorithm-executor";
import { router as algorithmExecuteRouter } from "./algorithm.execute.route";
import express from "express"
import { run } from "../services/database";

const router = express.Router();

router.get("/database", run);
router.use("/algorithm/execute", algorithmExecuteRouter);

export { router };
