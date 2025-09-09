import { useAlgorithmExecutionHandler } from '#src/handlers';
import { Router } from 'express';

const algorithmRouter = Router();

algorithmRouter.post('/build', async (request, response) => {
  console.log(
    `[LOG] Algorithm executed at time ${new Date().toISOString()}`,
  );
  const handle = useAlgorithmExecutionHandler();
  await handle(request, response);
});

export { algorithmRouter };
