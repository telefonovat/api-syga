import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import {
  ApiErrorResponse,
  GetUserAlgorithmsSuccessResponse,
} from '@telefonovat/syga--contract';
import { userDatabaseService } from '#src/services/database';

type GetUserAlgorithmsHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useGetUserAlgorithmsHandler(
  askerUsername: string,
  targetUsername: string,
) {
  const handler: GetUserAlgorithmsHandler = async (
    _request: Request,
    response: Response,
  ) => {
    const userExists =
      await userDatabaseService.userExists(targetUsername);
    if (!userExists) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        errorMessages: ['User does not exist'],
      };
      sendResponse(response, {
        statusCode: 404,
        content: errorResponse,
      });
      return;
    }

    // If asker !== target, just show public algorithms
    const algorithms =
      askerUsername === targetUsername
        ? await userDatabaseService.getAlgorithms(targetUsername)
        : [];

    const successResponse: GetUserAlgorithmsSuccessResponse = {
      success: true,
      payload: algorithms,
    };
    sendResponse(response, {
      statusCode: 200,
      content: successResponse,
    });
  };
  return handler;
}
