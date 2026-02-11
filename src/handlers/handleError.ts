import { ApiErrorResponse } from '@telefonovat/syga--contract';
import { z } from 'zod';

export function getErrorResponse(error: any): {
  statusCode: number;
  body: ApiErrorResponse;
} {
  if (error instanceof z.ZodError) {
    const statusCode = 400;
    const body: ApiErrorResponse = {
      success: false,
      errorMessages: ['Request body validation failed'],
    };

    return { statusCode, body };
  } else {
    const statusCode = 400;
    const body: ApiErrorResponse = {
      success: false,
      errorMessages: ['An unexpected error occured', error],
    };
    return { statusCode, body };
  }
}
