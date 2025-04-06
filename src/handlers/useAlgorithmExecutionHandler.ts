import { SygaApiErrorResponse } from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendError } from './sendError';

type AlgorithmExecutionHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAlgorithmExecutionHandler(): AlgorithmExecutionHandler {
  const handle: AlgorithmExecutionHandler = async (
    request: Request,
    response: Response,
  ) => {
    const statusCode = 400;
    const errorResponse: SygaApiErrorResponse = {
      success: false,
      errorMessages: ['empty body'],
    };

    sendError(response, { statusCode, errorResponse });
  };

  return handle;
}
