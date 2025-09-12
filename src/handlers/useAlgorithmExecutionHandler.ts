import {
  LegacyVisualizationResult,
  ApiErrorResponse,
  ExecuteAlgorithmRequestBodySchema,
  ExecuteAlgorithmRequestBody,
} from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { isExecuteAlgorithmRequest } from './validators/isExecuteAlgorithmRequest';
import { exec } from '#src/services/util/exec';
import { ExecuteAlgorithmSuccessResponse } from '@telefonovat/syga--contract/response/results';
import { safeJSONParse } from '#src/services/util';
import { fromLegacyVisualizationResult } from '#src/services/util/formatAdapters';
import { z } from 'zod';

type AlgorithmExecutionHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

interface EngineOutput {
  stdout: string;
  stderr: string;
}

async function runEngine(code: string): Promise<EngineOutput> {
  const shellCommand = `echo '${JSON.stringify({ code }).replace(/'/g, "'\\''")}' | docker container run --rm -i syga/engine`;
  const { stdout, stderr } = await exec(shellCommand, {});

  return { stdout, stderr };
}

async function runAlgorithm(code: string) {
  const { stdout } = await runEngine(code);

  //Legacy output format by previous developer
  const legacyOutput =
    safeJSONParse<LegacyVisualizationResult>(stdout);
  if (legacyOutput !== undefined) {
    return fromLegacyVisualizationResult(legacyOutput);
  } else {
    throw new Error('Backend sent gibberish');
  }
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
      if (error instanceof z.ZodError) {
        const statusCode = 400;
        const errorResponse: ApiErrorResponse = {
          success: false,
          errorMessages: ['Request body validation failed'],
        };

        sendResponse(response, {
          statusCode,
          content: errorResponse,
        });
      } else {
        const statusCode = 400;
        const errorResponse: ApiErrorResponse = {
          success: false,
          errorMessages: ['An unexpected error occured'],
        };

        sendResponse(response, {
          statusCode,
          content: errorResponse,
        });
      }
    }
  };

  return handle;
}
