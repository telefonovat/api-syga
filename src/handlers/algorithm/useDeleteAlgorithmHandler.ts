import { algorithmDatabaseService } from '#src/services/database';
import { ApiErrorResponse } from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from '../sendResponse';

type DeleteAlgorithmHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useDeleteAlgorithmHandler(
  uuid: string,
  askerUsername: string,
): DeleteAlgorithmHandler {
  const handler = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    if (
      !algorithmDatabaseService.ownsAlgorithm(askerUsername, uuid)
    ) {
      const errorBody: ApiErrorResponse = {
        success: false,
        errorMessages: ['Not authorized to view this algorithm'],
      };
      sendResponse(response, { statusCode: 401, content: errorBody });
      return;
    }
    console.log(
      `[LOG] algorithm ${uuid} deletion attempted by ${askerUsername}`,
    );

    try {
      await algorithmDatabaseService.deleteAlgorithm(uuid);
      sendResponse(response, { statusCode: 200, content: undefined });
    } catch (error) {
      sendResponse(response, { statusCode: 400, content: undefined });
    }
  };
  return handler;
}
