import { Request, Response } from 'express';
import {
  ApiErrorResponse,
  isAuthenticateRequest,
  AuthenticateSuccessResponse,
} from '@telefonovat/syga--contract';
import { sendResponse } from './sendResponse';
import {
  authService,
  tokenService,
} from '#src/services/authentication';
type AuthHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAuthHandler(): AuthHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    if (isAuthenticateRequest(body)) {
      if (
        authService.signInUser({
          username: body.username,
          password: body.password,
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
    } else {
      const errorResponse: ApiErrorResponse = {
        success: false,
        errorMessages: ['Invalid body'],
      };
      sendResponse(response, {
        statusCode: 400,
        content: errorResponse,
      });
    }
  };
  return handler;
}
