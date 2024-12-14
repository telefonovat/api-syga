import express from 'express';
import { APIResponse } from '#src/shared-types/APIResponse';
import { VisualizationRequest } from '#src/shared-types/visualization/VisualizationRequest';
import { algorithmExecutor } from '#src/controllers/algorithm';

const router = express.Router();

router.post('/', async (request, response) =>
  algorithmExecutor.handleRequest(request, response),
);

export { router };
