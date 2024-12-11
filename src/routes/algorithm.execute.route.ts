import express from 'express';
import { APIResponse } from '#src/shared-types/APIResponse';
import { algorithmExecutor } from '#src/controllers/algorithm/algorithm-executor';
import { VisualizationRequest } from '#src/shared-types/visualization/VisualizationRequest';

const router = express.Router();

router.post('/', async (request, response) => {
  algorithmExecutor
    .handleRequest(request.body as VisualizationRequest)
    .then((visualization) => {
      const successJSON: APIResponse = {
        success: true,
        message: 'Visualization succeeded',
        content: visualization,
      };
      response.status(200).json(successJSON);
    })
    .catch((error) => {
      const failureJSON: APIResponse = {
        success: false,
        message: 'Visualization failed',
        errors: error,
      };
      response.status(400).json(failureJSON);
    });
});

export { router };
