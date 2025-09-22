import { Request, Response } from 'express';
import {
  ApiErrorResponse,
  AuthenticateSuccessResponse,
  AuthenticateRequestBodySchema,
} from '@telefonovat/syga--contract';
import { sendResponse } from './sendResponse';
import {
  authService,
  tokenService,
} from '#src/services/authentication';
import { getErrorResponse } from './handleError';
import { httpUrl } from 'zod';
type AuthHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAuthHandler(): AuthHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    try {
      const authRequestBody =
        AuthenticateRequestBodySchema.parse(body);
      if (
        authService.signInUser({
          username: authRequestBody.username,
          password: authRequestBody.password,
        })
      ) {
        const successResponse: AuthenticateSuccessResponse = {
          success: true,
          payload: {
            accessToken: tokenService.signAccessToken({
              username: body.username,
            }),
            refreshToken: tokenService.signRefreshToken({
              username: body.username,
            }),
          },
        };

        response.cookie(
          'refresh_token',
          successResponse.payload.refreshToken,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
          },
        );
        response.cookie(
          'access_token',
          successResponse.payload.accessToken,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
          },
        );

        sendResponse(response, {
          statusCode: 200,
          content: successResponse,
        });
      } else {
        const failedAuthResponse: ApiErrorResponse = {
          success: false,
          errorMessages: ['Bad login'],
        };

        sendResponse(response, {
          statusCode: 200,
          content: failedAuthResponse,
        });
      }
    } catch (error: any) {
      const { statusCode, body } = getErrorResponse(error);
      sendResponse(response, { statusCode, content: body });
    }
  };
  return handler;
}
