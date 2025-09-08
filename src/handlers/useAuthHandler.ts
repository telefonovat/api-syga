import { Request, Response } from 'express';
import {
  ApiErrorResponse,
  isAuthenticateRequest,
  AuthenticateSuccessResponse,
} from '@telefonovat/syga--contract';
import { sendResponse } from './sendResponse';
type AuthHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAuthHandler(): AuthHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    if (isAuthenticateRequest(body)) {
      if (
        body.username === 'phone' &&
        body.password === 'phoneisawesome'
      ) {
        const successResponse: AuthenticateSuccessResponse = {
          success: true,
          payload: {
            accessToken: '',
            refreshToken: '',
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
