import express from 'express';
import { algorithmExecutor } from '#src/controllers/algorithm';

const router = express.Router();

/*
 *
 * Execute Python code sent from browser
 *
 */
router.post('/execute', async (request, response) =>
  algorithmExecutor.handleRequest(request, response),
);

export { router };
