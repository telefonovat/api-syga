import { useAuthHandler } from '#src/handlers/auth/useAuthHandler';
import { sendResponse } from '#src/handlers/sendResponse';
import { useSigninHandler } from '#src/handlers/useSigninHandler';
import { tokenService } from '#src/services/authentication';
import {
  Request,
  Response,
  NextFunction,
  Router,
  response,
} from 'express';

const authRouter = Router();

export const validateAccessToken = function (
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const accessToken = request.cookies.access_token;
    if (accessToken === undefined) {
      sendResponse(response, {
        statusCode: 401,
        content: ['No access token defined'],
      });
      return;
    }

    const tokenPayload = tokenService.verifyAccessToken(accessToken);

    if (!tokenPayload) {
      sendResponse(response, {
        statusCode: 401,
        content: ['Token verification failed'],
      });
      return;
    }

    const { username } = tokenPayload;

    response.locals.username = username;
    next();
  } catch (e: any) {
    sendResponse(response, {
      statusCode: 400,
      content: ['An unexpected error occured'],
    });
  }
};

authRouter.post('/signin', async (request, response) => {
  const handle = useSigninHandler();
  await handle(request, response);
});

authRouter.post('/auth', async (request, response) => {
  const handle = useAuthHandler();
  await handle(request, response);
});

export { authRouter };
