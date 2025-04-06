import { SygaApiErrorResponse } from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { isExecuteAlgorithmRequest } from './validators/isExecuteAlgorithmRequest';

type AlgorithmExecutionHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

export function useAlgorithmExecutionHandler(): AlgorithmExecutionHandler {
  const handle: AlgorithmExecutionHandler = async (
    request: Request,
    response: Response,
  ) => {
    const body = request.body;
    console.log(`body : ${body.code}`);
    if (isExecuteAlgorithmRequest(body)) {
      const statusCode = 200;
      sendResponse(response, { statusCode, content: { done: true } });
    } else {
      const statusCode = 400;
      const errorResponse: SygaApiErrorResponse = {
        success: false,
        errorMessages: ['empty body'],
      };

      sendResponse(response, { statusCode, content: errorResponse });
    }
  };

  return handle;
}
