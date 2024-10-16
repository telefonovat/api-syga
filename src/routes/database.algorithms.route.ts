import express from "express"
import { getAlgorithm } from "../services/database/index";

const router = express.Router();


router.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  let results = await getAlgorithm(slug);
  res.send(results).status(200);
});

export { router };
