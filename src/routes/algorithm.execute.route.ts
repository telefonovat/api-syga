import express from "express";
import { algorithmExecutor } from "../controllers/algorithm/algorithm-executor";

const router = express.Router();

router.post("/", async (req, res) => {
  const visualization = await algorithmExecutor.handleRequest({ code: "" });
  res.json(visualization);
});

router.get("/", (req, res) => {
  res.send("Nothing to get here...");
})

export { router };
