import { useAlgorithmExecutionHandler } from '#src/handlers';
import { Router } from 'express';

const algorithmRouter = Router();

algorithmRouter.post('/execute', async (request, response) => {
  const handle = useAlgorithmExecutionHandler();
  await handle(request, response);
});

export { algorithmRouter };
