import { userDatabaseService } from '#src/services/database';
import {
  ApiErrorResponse,
  isAddAlgorithmsRequestBody,
} from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';

type AddAlgorithmsHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAddAlgorithmsHandler(
  username: string,
): AddAlgorithmsHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    if (isAddAlgorithmsRequestBody(body)) {
      const { algorithms } = body;
      userDatabaseService.addAlgorithms(username, algorithms);

      sendResponse(response, { statusCode: 201, content: {} });
    } else {
      const invalidBodyResponse: ApiErrorResponse = {
        success: false,
        errorMessages: ['Request body is invalid'],
      };
      sendResponse(response, {
        statusCode: 400,
        content: invalidBodyResponse,
      });
    }
  };

  return handler;
}
