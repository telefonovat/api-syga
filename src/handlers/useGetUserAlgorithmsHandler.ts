import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import {
  GetUserAlgorithmsSuccessResponse,
  SygaAlgorithmIdentifier,
} from '@telefonovat/syga--contract';
import {
  connectToDatabase,
  userDatabaseService,
} from '#src/services/database';

type GetUserAlgorithmsHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useGetUserAlgorithmsHandler(username: string) {
  const handler: GetUserAlgorithmsHandler = async (
    request: Request,
    response: Response,
  ) => {
    //TODO: Remove, just temporary
    await connectToDatabase();

    const algorithms =
      await userDatabaseService.getAlgorithms(username);

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
