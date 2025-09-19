import { userDatabaseService } from '#src/services/database';
import {
  AddAlgorithmsSuccessBody,
  AddAlgorithmsRequestBodySchema,
} from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { getErrorResponse } from './handleError';

type AddAlgorithmsHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAddAlgorithmsHandler(
  username: string,
): AddAlgorithmsHandler {
  const handler = async (request: Request, response: Response) => {
    const body = request.body;
    try {
      const addAlgorithmsRequestBody =
        AddAlgorithmsRequestBodySchema.parse(body);
      const { algorithms } = addAlgorithmsRequestBody;

      const algorithmIdentifiers =
        await userDatabaseService.addAlgorithms(username, algorithms);

      const responseBody: AddAlgorithmsSuccessBody = {
        success: true,
        payload: algorithmIdentifiers,
      };
      sendResponse(response, {
        statusCode: 201,
        content: responseBody,
      });
    } catch (error) {
      const { statusCode, body } = getErrorResponse(error);
      sendResponse(response, { statusCode, content: body });
    }
  };

  return handler;
}
