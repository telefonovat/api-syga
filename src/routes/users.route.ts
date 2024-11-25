import express from 'express';
import { User } from '#src/services/database/schemas/UserSchema';
import { userRegistrationController } from '#src/controllers/users/user-registration-controller';
import { userLoginController } from '#src/controllers/users/user-login-controller';

const router = express.Router();

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

router.post('/login', async (request, response) => {
  userLoginController
    .login(request.body.user as User)
    .then((jwt) => {
      response.status(200).json(jwt);
    })
    .catch((error) => {
      response.status(401).send('Log in failed');
    });
});

export { router };
