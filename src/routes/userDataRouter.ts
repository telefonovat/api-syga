import { Router } from 'express';
import { validateAccessToken } from './authRouter';
import { useGetUserAlgorithmsHandler } from '#src/handlers/useGetUserAlgorithmsHandler';

const userDataRouter = Router();

userDataRouter.get(
  '/:username/algorithms',
  validateAccessToken,
  async (request, response) => {
    const asker = response.locals.username;
    const target = request.params.username;
    console.log(
      `[LOG] GET user algorithms requests from ${asker} to ${target}`,
    );
    const handle = useGetUserAlgorithmsHandler(asker, target);
    handle(request, response);
  },
);

export { userDataRouter };
