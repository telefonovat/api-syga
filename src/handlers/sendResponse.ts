import { Response } from 'express';

interface ResponseData {
  statusCode: number;
  content: Object | undefined;
}

export function sendResponse(
  response: Response,
  responseData: ResponseData,
) {
  response.statusCode = responseData.statusCode;
  response.send(responseData.content);
}
