import { useAlgorithmExecutionHandler } from '#src/handlers/useAlgorithmExecutionHandler.js';
import { Router } from 'express';

const algorithmDetailRouter = Router();

algorithmDetailRouter.post('/build', async (request, response) => {
  console.log(
    `[LOG] Algorithm executed at time ${new Date().toISOString()}`,
  );
  const handle = useAlgorithmExecutionHandler();
  await handle(request, response);
});

export { algorithmDetailRouter };
