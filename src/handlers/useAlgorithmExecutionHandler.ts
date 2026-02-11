import {
  LegacyVisualizationResult,
  ExecuteAlgorithmRequestBodySchema,
  ExecuteAlgorithmRequestBody,
} from '@telefonovat/syga--contract';
import { Request, Response } from 'express';
import { sendResponse } from './sendResponse';
import { exec } from '#src/services/util/exec';
import { ExecuteAlgorithmSuccessResponse } from '@telefonovat/syga--contract/response/results';
import { safeJSONParse } from '#src/services/util';
import { fromLegacyVisualizationResult } from '#src/services/util/formatAdapters';
import { getErrorResponse } from './handleError';
type AlgorithmExecutionHandler = (
  request: Request,
  response: Response,
) => Promise<void>;

interface EngineOutput {
  stdout: string;
  stderr: string;
}

async function runEngine(code: string): Promise<EngineOutput> {
  // const shellCommand = `echo '${JSON.stringify({ code }).replace(/'/g, "'\\''")}' | docker container run --rm -i syga/engine`;
  const echoCommand = `echo ${JSON.stringify(JSON.stringify({ code }))}`;
  // console.log(echoCommand);
  // const shellCommand = `${echoCommand} | docker container run --rm -i syga/engine`;
  const shellCommand = `echo "{\"code\":\"print('Hello');\"}" | docker container run --rm -i syga/engine `;
  console.log(shellCommand);
  const { stdout, stderr } = await exec(shellCommand, {});

  return { stdout, stderr };
}

async function runAlgorithm(code: string) {
  const response = await fetch('http://engine:5000/v1/run', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const stdout = (await response.json()) as any;

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
      const { statusCode, body } = getErrorResponse(error);
      sendResponse(response, { statusCode, content: body });
    }
  };

  return handle;
}
