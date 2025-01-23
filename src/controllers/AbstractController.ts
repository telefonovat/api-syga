import { APIResponse } from '#src/shared-types/APIResponse';
import { Response } from 'express';
import express from 'express';
type ResponseBodyType = APIResponse['content'];

abstract class AbstractController {
  // public abstract handleRequest(
  //   request: express.Request,
  //   response: express.Response,
  // ): Promise<void>;
  protected sendResponse<T extends ResponseBodyType>(
    response: Response,

    statusCode: number = 200,
    content: T | undefined = undefined,
    message: string = 'Success',
  ) {
    const responseBody: APIResponse = {
      success: true,
      message: message,
      ...(content !== undefined && { content: content }),
    };

    response.status(statusCode).json(responseBody);
  }

  protected sendError<T extends Error>(
    response: Response,

    statusCode: number = 400,

    error: T | undefined = undefined,
    message: string = 'Failure',
  ) {
    const responseBody: APIResponse = {
      success: false,
      message: message,
      ...(error !== undefined && { errors: error }),
    };

    response.status(statusCode).json(responseBody);
  }
}

export { AbstractController };
