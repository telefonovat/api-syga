import { Request, Response } from 'express';
import {
  ApiErrorResponse,
  isAuthenticateRequest,
  AuthenticateSuccessResponse,
  AuthenticateRequestSchema,
} from '@telefonovat/syga--contract';
import { sendResponse } from './sendResponse';
import {
  authService,
  tokenService,
} from '#src/services/authentication';
import { getErrorResponse } from './handleError';
type AuthHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAuthHandler(): AuthHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    try {
      const authRequestBody = AuthenticateRequestSchema.parse(body);
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
