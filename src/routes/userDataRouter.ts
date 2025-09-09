import { Router } from 'express';
import { validateAccessToken } from './authRouter';
import { useGetUserAlgorithmsHandler } from '#src/handlers/useGetUserAlgorithmsHandler';

const userDataRouter = Router();

userDataRouter.get(
  '/algorithms',
  validateAccessToken,
  async (request, response) => {
    const handle = useGetUserAlgorithmsHandler(
      response.locals.username,
    );
    handle(request, response);
  },
);

export { userDataRouter };
