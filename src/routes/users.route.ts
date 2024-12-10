import express, { NextFunction, Request, Response } from 'express';
import {
  User,
  UserLoginInfo,
} from '#src/services/database/schemas/UserSchema';
import { userRegistrationController } from '#src/controllers/users/user-registration-controller';
import { userLoginController } from '#src/controllers/users/user-login-controller';
import { userDatabase } from '#src/services/database';

import jwt, { decode, Jwt } from 'jsonwebtoken';
import { config } from '#src/config';

const router = express.Router();

interface JwtPayload {
  username: string;
  role: 'admin' | 'student';
}

const validateJWT = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    if (!request.body?.token) {
      response.status(400).json({ error: 'No JWT token' });
      return;
    }

    const { username } = jwt.verify(
      request.body.token,
      config.JWT_SECRET!,
    ) as JwtPayload;

    if (request.params.username !== username) {
      response.status(403).json({ error: 'Invalid token' });
      return;
    }

    response.locals.username = username;
    next();
  } catch (error: any) {
    response.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};

// Accepts every field from UserSchema except role
// The role is assigned on the server side
router.post('/register', async (request, response) => {
  const user = request.body.user as User;

  //No admin or teacher privilges
  userRegistrationController
    .register({ ...user, role: 'student' })
    .then(() => {
      response.status(201).json('User successfully registered');
    })
    .catch((error) => {
      response
        .status(422)
        .json({ error: `User registration failed : ${error}` });
    });
});

//Accepts username and password
router.post('/login', async (request, response) => {
  userLoginController
    .login(request.body.user as UserLoginInfo)
    .then((jwt) => {
      response.status(200).json({ token: jwt });
    })
    .catch((error) => {
      response.status(401).json({ error: error });
    });
});

router.post(
  '/:username/codes',
  validateJWT,
  async (request, response) => {
    const username = response.locals.username;
    if (!request.body?.code) {
      response.status(403).json({ error: 'No code attached' });
      return;
    }
    userDatabase
      .saveAlgorithm(username, {
        uuid: 'hello',
        code: request.body.code,
      })
      .then(() => {
        response.status(200).json({ success: 'Algorithm saved!' });
      })
      .catch((error) => {
        response
          .status(422)
          .json({ error: `Cannot save algorithm : ${error}` });
      });
  },
);

router.get('/:username', validateJWT, async (request, response) => {
  const username = response.locals.username;
  userDatabase
    .getUser(username)
    .then((user) => {
      response.status(200).json({ user: user });
    })
    .catch((error) => {
      response.status(404).json({ error: error });
    });
});

export { router };
