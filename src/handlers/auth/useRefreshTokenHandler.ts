import { tokenService } from '#src/services/authentication';
import { AuthenticationSuccessBody } from '@telefonovat/syga--contract';
import { sendResponse } from '../sendResponse';
import { Response, Request } from 'express';

type RefreshTokenHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useRefreshTokenHandler(): RefreshTokenHandler {
  const handler = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const refreshToken = request.cookies.refresh_token;
    if (refreshToken === undefined) {
      sendResponse(response, {
        statusCode: 401,
        content: ['No refresh token was defined'],
      });
      return;
    }

    const tokenPayload =
      tokenService.verifyRefreshToken(refreshToken);

    if (!tokenPayload) {
      sendResponse(response, {
        statusCode: 401,
        content: ['Refresh token verification failed'],
      });
      return;
    }

    const authSuccessBody: AuthenticationSuccessBody = {
      success: true,
      payload: {
        username: tokenPayload.username,
      },
    };

    response.cookie(
      'refresh_token',
      tokenService.signRefreshToken(authSuccessBody.payload),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      },
    );
    response.cookie(
      'access_token',
      tokenService.signAccessToken(authSuccessBody.payload),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      },
    );
    sendResponse(response, {
      statusCode: 200,
      content: authSuccessBody,
    });
  };
  return handler;
}
