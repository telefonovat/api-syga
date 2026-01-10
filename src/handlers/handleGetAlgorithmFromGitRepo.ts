import { Request, Response } from 'express';
import { getErrorResponse } from './handleError';
import { sendResponse } from './sendResponse';

interface Options {
  algorithmPath: string;
}
export async function handleGetAlgorithmFromGitRepo(
  _request: Request,
  response: Response,
  { algorithmPath }: Options,
) {
  try {
    const res = await fetch(
      `https:/raw.githubusercontent.com/telefonovat/syga--algorithms/main/${algorithmPath}`,
    );

    if (!res.ok) {
      throw new Error('File not found');
    }

    const algorithm = await res.text();
    const responseBody = {
      success: true,
      payload: [algorithm],
    };
    sendResponse(response, {
      statusCode: 200,
      content: responseBody,
    });
  } catch (error) {
    console.log(error);
    const { statusCode, body } = getErrorResponse(error);
    sendResponse(response, { statusCode, content: body });
  }
}
