import express from 'express';
import { User } from '#src/services/database/UserDatabase';
import { userRegistrationController } from '#src/controllers/users/user-registration-controller';

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

export { router };
