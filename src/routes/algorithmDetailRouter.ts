import { useAlgorithmExecutionHandler } from '#src/handlers';
import { request, Router } from 'express';
import { validateAccessToken } from './authRouter';
import { useGetAlgorithmDetailHandler } from '#src/handlers/algorithm/useGetAlgorithmDetailHandler';

const algorithmDetailRouter = Router();

algorithmDetailRouter.post('/build', async (request, response) => {
  console.log(
    `[LOG] Algorithm executed at time ${new Date().toISOString()}`,
  );
  const handle = useAlgorithmExecutionHandler();
  await handle(request, response);
});

algorithmDetailRouter.get(
  '/:uuid',
  validateAccessToken,
  async (request, response) => {
    const asker = response.locals.username;
    const uuid = request.params.uuid;

    const handle = useGetAlgorithmDetailHandler(uuid, asker);
    handle(request, response);
  },
);

export { algorithmDetailRouter };
