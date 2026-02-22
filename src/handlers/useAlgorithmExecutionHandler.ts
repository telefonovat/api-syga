import {
  ExecuteAlgorithmRequestBodySchema,
  ExecuteAlgorithmRequestBody,
} from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { ExecuteAlgorithmSuccessResponse } from '@telefonovat/syga--contract/response/results';
import { fromLegacyVisualizationResult } from '#src/services/util/formatAdapters';
import { getErrorResponse } from './handleError';
type AlgorithmExecutionHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

async function runAlgorithm(code: string) {
  const response = await fetch('http://nginx:80/engine/v1/run', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const stdout = (await response.json()) as any;

  if (stdout.res === 'error') {
    throw new Error(
      stdout.err ??
        'An unknown error occured while trying to execute code.',
    );
  }
  // NOTE: Unsafe
  return fromLegacyVisualizationResult(stdout);
}

export function useAlgorithmExecutionHandler(): AlgorithmExecutionHandler {
  const handle: AlgorithmExecutionHandler = async (
    request: Request,
    response: Response,
  ) => {
    const body = request.body;
    try {
      const executeRequestBody: ExecuteAlgorithmRequestBody =
        ExecuteAlgorithmRequestBodySchema.parse(body);

      const result = await runAlgorithm(executeRequestBody.code);
      const successResponse: ExecuteAlgorithmSuccessResponse = {
        success: true,
        payload: result,
      };

      sendResponse(response, {
        statusCode: 200,
        content: successResponse,
      });
    } catch (error) {
      if (error instanceof Error) {
        const payload = { errorMessage: error.message };
        response.status(400).send({ success: false, payload });
      } else {
        const { statusCode, body } = getErrorResponse(error);
        sendResponse(response, { statusCode, content: body });
      }
    }
  };

  return handle;
}
