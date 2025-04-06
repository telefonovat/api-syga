import { SygaApiErrorResponse } from '@telefonovat/syga--contract';
import { Response } from 'express';

interface ErrorData {
  statusCode: number;
  errorResponse: SygaApiErrorResponse;
}

export function sendError(response: Response, errorData: ErrorData) {
  response.statusCode = errorData.statusCode;
  response.send(errorData.errorResponse);
}
