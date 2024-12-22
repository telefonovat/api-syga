import { Request, Response, NextFunction } from 'express';
import { config } from '#src/config';
import jwt from 'jsonwebtoken';
import { APIResponse } from '#src/shared-types/APIResponse';

const createErrorResponse = (errorMessage: string): APIResponse => {
  return {
    success: false,
    message: errorMessage,
  };
};

interface JwtPayload {
  username: string;
  role: 'admin' | 'student';
}
export const validateJWT = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authorizationHeader = request.get('Authorization');
    if (authorizationHeader === undefined) {
      response.status(400).json(createErrorResponse('No JWT Token'));
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    const { username } = jwt.verify(
      token,
      config.JWT_SECRET!,
    ) as JwtPayload;

    if (request.params.username !== username) {
      response
        .status(403)
        .json(
          createErrorResponse('User does not match the JWT token.'),
        );
      return;
    }

    response.locals.username = username;
    next();
  } catch (error: any) {
    response
      .status(401)
      .json(
        createErrorResponse('Unknown error while decrypting JWT'),
      );
    return;
  }
};
