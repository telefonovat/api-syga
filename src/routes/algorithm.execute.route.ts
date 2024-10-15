import express from "express";
import { algorithmExecutor } from "../controllers/algorithm/algorithm-executor";

const router = express.Router();

router.post("/", async (req, res) => {
  algorithmExecutor.handleRequest({ code: "" });
  res.send("Executing algorithm!");
});

router.get("/", (req, res) => {
  res.send("Nothing to get here...");
})

export { router };
