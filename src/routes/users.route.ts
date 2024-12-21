import express, { NextFunction, Request, Response } from 'express';
import {
  User,
  UserLoginInfo,
} from '#src/shared-types/user/Authentication';
import { userDatabase } from '#src/services/database';

import jwt, { decode, Jwt } from 'jsonwebtoken';
import { config } from '#src/config';
import { APIResponse } from '#src/shared-types/APIResponse';
import {
  userCodesController,
  userLoginController,
  userRegistrationController,
} from '#src/controllers/users';

const router = express.Router();

interface JwtPayload {
  username: string;
  role: 'admin' | 'student';
}

const createErrorResponse = (errorMessage: string): APIResponse => {
  return {
    success: false,
    message: errorMessage,
  };
};

const validateJWT = (
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
        .json(createErrorResponse('User does match the JWT token.'));
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

// Accepts every field from UserSchema except role
// The role is assigned on the server side
router.post('/register', async (request, response) =>
  userRegistrationController.handleRequest(request, response),
);

//Accepts username and password
router.post('/login', async (request, response) =>
  userLoginController.handleRequest(request, response),
);

router.get('/:username/codes', validateJWT, (request, response) =>
  userCodesController.handleRequest(request, response),
);
router.post(
  '/:username/codes',
  validateJWT,
  async (request, response) => {
    const username = response.locals.username;

    const requestBody = request.body;

    if (!requestBody.content?.code) {
      response.status(403).json({ error: 'No code attached' });
      return;
    }
    const code = requestBody.content.code as string;
    userDatabase
      .saveAlgorithm(username, {
        uuid: 'hello',
        title: code.slice(0, 5),
        code: code,
        tags: [],
        isPublic: true,
      })
      .then(() => {
        const successResponse: APIResponse = {
          success: true,
          message: 'Algorithm saved',
        };
        response.status(200).json(successResponse);
      })
      .catch((error) => {
        response.status(422).json({
          ...createErrorResponse('Cannot save algorithm'),
          errors: error,
        });
      });
  },
);

router.get('/:username/codes/public', async (request, response) => {
  const algorithms = await userDatabase.getAlgorithms(
    request.params.username,
  );

  const publicAlgorithms = algorithms.filter(
    (algorithm) => algorithm.isPublic,
  );

  const responseBody: APIResponse = {
    success: true,
    message: '',
    content: algorithms,
  };
  response.status(200).json(responseBody);
});

router.get('/:username', validateJWT, async (request, response) => {
  const username = response.locals.username;
  userDatabase
    .getUser(username)
    .then((user) => {
      const successResponse: APIResponse = {
        success: true,
        message: '',
        content: {
          user: user,
        },
      };
      response.status(200).json(successResponse);
    })
    .catch((error) => {
      const failureResponse: APIResponse = {
        success: false,
        message: '',
        errors: error,
      };
      response.status(404).json(failureResponse);
    });
});

export { router };
