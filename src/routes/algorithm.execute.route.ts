import express from 'express';
import { algorithmExecutor } from '#src/controllers/algorithm/algorithm-executor';
import { VisualizationRequest } from '#src/shared-types/visualization/VisualizationRequest';

const router = express.Router();

router.post('/', async (request, response) => {
  const visualization = await algorithmExecutor.handleRequest(
    request.body as VisualizationRequest,
  );
  response.json(visualization);
});

export { router };
