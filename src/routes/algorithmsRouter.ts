import { useAddAlgorithmsHandler } from '#src/handlers/useAddAlgorithmsHandler';
import { Router } from 'express';
import { validateAccessToken } from './authRouter';

const algorithmsRouter = Router();

algorithmsRouter.post(
  '',
  validateAccessToken,
  async (request, response) => {
    const handle = useAddAlgorithmsHandler(response.locals.username);
    await handle(request, response);
  },
);

export { algorithmsRouter };
