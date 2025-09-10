import { Router } from 'express';
import { validateAccessToken } from './authRouter';
import { useGetUserAlgorithmsHandler } from '#src/handlers/useGetUserAlgorithmsHandler';

const userDataRouter = Router();

userDataRouter.get(
  '/:username/algorithms',
  validateAccessToken,
  async (request, response) => {
    const handle = useGetUserAlgorithmsHandler(
      response.locals.username,
      request.params.username,
    );
    handle(request, response);
  },
);

export { userDataRouter };
