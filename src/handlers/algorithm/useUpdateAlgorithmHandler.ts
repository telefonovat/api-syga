import { algorithmDatabaseService } from '#src/services/database';
import {
  ApiErrorResponse,
  UpdateAlgorithmRequestBody,
  UpdateAlgorithmRequestBodySchema,
} from '@telefonovat/syga--contract';
import { sendResponse } from '../sendResponse';
import { Response, Request } from 'express';
import { getErrorResponse } from '../handleError';

type UpdateAlgorithmHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useUpdateAlgorithmHandler(
  uuid: string,
  askerUsername: string,
): UpdateAlgorithmHandler {
  const handler = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    if (
      !algorithmDatabaseService.ownsAlgorithm(askerUsername, uuid)
    ) {
      const errorBody: ApiErrorResponse = {
        success: false,
        errorMessages: ['Not authorized to modify this algorithm'],
      };
      sendResponse(response, { statusCode: 401, content: errorBody });
      return;
    }
    console.log(
      `[LOG] algorithm ${uuid} update attempted by ${askerUsername}`,
    );

    const body = request.body;

    try {
      const updateParams =
        UpdateAlgorithmRequestBodySchema.parse(body);
      await algorithmDatabaseService.updateAlgorithm(
        uuid,
        updateParams,
      );
      sendResponse(response, { statusCode: 200, content: undefined });
    } catch (error) {
      const { statusCode, body } = getErrorResponse(error);
      sendResponse(response, {
        statusCode: statusCode,
        content: body,
      });
    }
  };
  return handler;
}
