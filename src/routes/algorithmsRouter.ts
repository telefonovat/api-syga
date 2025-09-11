import { useAddAlgorithmsHandler } from '#src/handlers/useAddAlgorithmsHandler';
import { Router } from 'express';
import { validateAccessToken } from './authRouter';

const algorithmsRouter = Router();

algorithmsRouter.post(
  '',
  validateAccessToken,
  async (request, response) => {
    const asker = response.locals.username;
    console.log(`[LOG] attempt to add algorithms by ${asker}`);
    const handle = useAddAlgorithmsHandler(asker);
    await handle(request, response);
  },
);

export { algorithmsRouter };
