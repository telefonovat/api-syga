import { Request, Response } from 'express';
import { sendResponse } from '../sendResponse';
import { tokenService } from '#src/services/authentication';
import { AuthenticationSuccessBody } from '@telefonovat/syga--contract';

type AuthHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAuthHandler(): AuthHandler {
  const handler = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
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

    const authSuccessBody: AuthenticationSuccessBody = {
      success: true,
      payload: {
        username: tokenPayload.username,
      },
    };
    sendResponse(response, {
      statusCode: 200,
      content: authSuccessBody,
    });
  };
  return handler;
}
