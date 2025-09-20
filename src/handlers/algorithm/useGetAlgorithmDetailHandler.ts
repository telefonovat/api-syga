import { algorithmDatabaseService } from '#src/services/database';
import { Request, Response } from 'express';
import { sendResponse } from '../sendResponse';
import {
  ApiErrorResponse,
  GetAlgorithmDetailSuccessBody,
} from '@telefonovat/syga--contract';
import { getErrorResponse } from '../handleError';

type GetAlgorithmDetailHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useGetAlgorithmDetailHandler(
  uuid: string,
  askerUsername: string,
): GetAlgorithmDetailHandler {
  const handler = async (
    _request: Request,
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
    console.log(`[LOG] algorithm ${uuid} viewed by ${askerUsername}`);

    try {
      const algorithmPublicView =
        await algorithmDatabaseService.getAlgorithmDetail(uuid);

      const body: GetAlgorithmDetailSuccessBody = {
        success: true,
        payload: algorithmPublicView,
      };

      sendResponse(response, {
        statusCode: 200,
        content: body,
      });
    } catch (error) {
      const { statusCode, body } = getErrorResponse(error);
      sendResponse(response, { statusCode, content: body });
      return;
    }
  };
  return handler;
}
