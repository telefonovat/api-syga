import express from 'express';
import { User } from '#src/services/database/schemas/UserSchema';
import { userRegistrationController } from '#src/controllers/users/user-registration-controller';
import { userLoginController } from '#src/controllers/users/user-login-controller';
import { userDatabase } from '#src/services/database';

import jwt, { decode, Jwt } from 'jsonwebtoken';

const router = express.Router();

// Accepts every field from UserSchema except role
// The role is assigned on the server side
router.post('/register', async (request, response) => {
  console.log(`Registering : ${request.body.user}`);
  userRegistrationController
    .register(request.body.user as User)
    .then(() => {
      response.status(201).send('User successfully registered');
    })
    .catch((error) => {
      console.error(`Cannot register : ${error}`);
      response.status(422).send('User registration failed!');
    });
});

//Accepts username and password
router.post('/login', async (request, response) => {
  userLoginController
    .login(request.body.user as Omit<User, 'role'>)
    .then((jwt) => {
      response.status(200).json({ token: jwt });
    })
    .catch((error) => {
      if (error instanceof Error) {
        response.status(401).send({ error: error.message });
      } else {
        response.status(401).send({ error: 'Unknown error' });
      }
    });
});

router.get('/:username', async (request, response) => {
  if (!request.body?.token) {
    response.status(400).json({ error: 'No JWT token' });
    return;
  }
  interface JwtPayload {
    username: string;
    role: 'admin' | 'student';
  }
  const { username } = jwt.verify(
    request.body.token,
    'hiiamphone',
  ) as JwtPayload;

  if (request.params.username !== username) {
    response.status(403).json({ error: 'Invalid token' });
    return;
  }

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
