import { useAuthHandler } from '#src/handlers/useAuthHandler';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signin', async (request, response) => {
  const handle = useAuthHandler();
  await handle(request, response);
});

export { authRouter };
