import { sendResponse } from '#src/handlers/sendResponse';
import { useAuthHandler } from '#src/handlers/useAuthHandler';
import { tokenService } from '#src/services/authentication';
import { Request, Response, NextFunction, Router } from 'express';

const authRouter = Router();

export const validateAccessToken = function (
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = request.get('Authorization');
    if (authorizationHeader === undefined) {
      sendResponse(response, {
        statusCode: 400,
        content: ['No authorization header'],
      });
      return;
    }

    const token = authorizationHeader.split(' ')[1];
    const tokenPayload = tokenService.verifyAccessToken(token);

    if (!tokenPayload) {
      sendResponse(response, {
        statusCode: 400,
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
  const handle = useAuthHandler();
  await handle(request, response);
});

export { authRouter };
