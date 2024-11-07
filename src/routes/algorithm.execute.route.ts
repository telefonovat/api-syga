import express from "express";
import { algorithmExecutor } from "../controllers/algorithm/algorithm-executor";
import type { Algorithm } from "src/services/algorithm-runner/algorithm-runner";

const router = express.Router();

router.post("/", async (req, res) => {
  const visualization
    = await algorithmExecutor.handleRequest(req.body as Algorithm);
  res.json(visualization);
});

router.get("/", (req, res) => {
  res.send("Nothing to get here...");
})

export { router };
