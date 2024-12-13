import express, { NextFunction, Request, Response } from 'express';
import {
  User,
  UserLoginInfo,
} from '#src/shared-types/user/Authentication';
import { userRegistrationController } from '#src/controllers/users/user-registration-controller';
import { userLoginController } from '#src/controllers/users/user-login-controller';
import { userDatabase } from '#src/services/database';

import jwt, { decode, Jwt } from 'jsonwebtoken';
import { config } from '#src/config';
import { APIResponse } from '#src/shared-types/APIResponse';

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
    if (!request.body?.token) {
      response.status(400).json(createErrorResponse('No JWT Token'));
      return;
    }

    const { username } = jwt.verify(
      request.body.token,
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
router.post('/register', async (request, response) => {
  const requestBody = request.body;
  const user = requestBody.content as User;

  //No admin or teacher privilges
  userRegistrationController
    .register({ ...user, role: 'student' })
    .then(() => {
      const successResponse: APIResponse = {
        success: true,
        message: 'User successfully registered',
      };
      response.status(201).json(successResponse);
    })
    .catch((error) => {
      response
        .status(422)
        .json(createErrorResponse('User registration failed'));
    });
});

//Accepts username and password
router.post('/login', async (request, response) => {
  const requestBody = request.body;
  const loginInfo = requestBody.content as UserLoginInfo;
  userLoginController
    .login(loginInfo)
    .then((jwt) => {
      const successResponse: APIResponse = {
        success: true,
        message: 'Log in successful. Here is a JSON Web token',
        content: {
          token: jwt,
        },
      };
      response.status(200).json(successResponse);
    })
    .catch((error) => {
      response.status(401).json({
        ...createErrorResponse('Log in failed'),
        errors: error,
      });
    });
});

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
    const code = requestBody.content.code;
    userDatabase
      .saveAlgorithm(username, {
        uuid: 'hello',
        code: request.body.code,
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
