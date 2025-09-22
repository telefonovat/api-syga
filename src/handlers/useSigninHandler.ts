import { Request, Response } from 'express';
import {
  ApiErrorResponse,
  SigninSucessBody,
  AuthenticateRequestBodySchema,
  AuthenticationSuccessBody,
} from '@telefonovat/syga--contract';
import { sendResponse } from './sendResponse';
import {
  authService,
  tokenService,
} from '#src/services/authentication';
import { getErrorResponse } from './handleError';
type SigninHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useSigninHandler(): SigninHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    try {
      const authRequestBody =
        AuthenticateRequestBodySchema.parse(body);
      if (
        await authService.isSignInValid({
          username: authRequestBody.username,
          password: authRequestBody.password,
        })
      ) {
        const successResponse: AuthenticationSuccessBody = {
          success: true,
          payload: {
            username: authRequestBody.username,
          },
        };

        response.cookie(
          'refresh_token',
          tokenService.signRefreshToken({
            username: authRequestBody.username,
          }),
          {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
          },
        );
        response.cookie(
          'access_token',
          tokenService.signAccessToken({
            username: authRequestBody.username,
          }),
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
