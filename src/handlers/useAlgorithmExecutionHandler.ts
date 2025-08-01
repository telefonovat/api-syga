import {
  LegacyVisualizationResult,
  SygaApiErrorResponse,
} from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { isExecuteAlgorithmRequest } from './validators/isExecuteAlgorithmRequest';
import { config } from '#src/config';
import { exec } from '#src/services/util/exec';
import { backendAdaptor } from '#src/services/adaptors/backend-adaptor';
import { ExecuteAlgorithmSuccessResponse } from '@telefonovat/syga--contract/response/results';
import { safeJSONParse } from '#src/services/util';
import { fromLegacyVisualizationResult } from '#src/services/util/formatAdapters';

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
    if (isExecuteAlgorithmRequest(body)) {
      const statusCode = 200;
      const result = await runAlgorithm(body.code);
      const successResponse: ExecuteAlgorithmSuccessResponse = {
        success: true,
        result: result,
      };

      sendResponse(response, {
        statusCode,
        content: successResponse,
      });
    } else {
      const statusCode = 400;
      const errorResponse: SygaApiErrorResponse = {
        success: false,
        errorMessages: ['Invalid body'],
      };

      sendResponse(response, { statusCode, content: errorResponse });
    }
  };

  return handle;
}
