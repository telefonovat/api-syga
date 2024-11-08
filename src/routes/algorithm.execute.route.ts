import express from 'express';
import { algorithmExecutor } from '../controllers/algorithm/algorithm-executor';
import { VisualizationRequest } from 'src/shared-types/visualization/VisualizationRequest';

const router = express.Router();

router.post('/', async (req, res) => {
  const visualization = await algorithmExecutor.handleRequest(
    req.body as VisualizationRequest,
  );
  res.json(visualization);
});

router.get('/', (req, res) => {
  res.send('Nothing to get here...');
});

export { router };
