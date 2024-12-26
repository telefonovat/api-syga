import express from 'express';
import { userDatabase } from '#src/services/database';

import { validateJWT } from '#src/middleware';
import { APIResponse } from '#src/shared-types/APIResponse';
import {
  userAlgorithmsGetter,
  userAlgorithmsPoster,
  userLoginController,
  userRegistrationController,
} from '#src/controllers/users';

const router = express.Router();

// Accepts every field from UserSchema except role
// The role is assigned on the server side
router.post('/register', async (request, response) =>
  userRegistrationController.handleRequest(request, response),
);

//Accepts username and password
router.post('/login', async (request, response) =>
  userLoginController.handleRequest(request, response),
);

router.get(
  '/:username/algorithms',
  validateJWT,
  (request, response) =>
    userAlgorithmsGetter.handleRequest(request, response),
);
router.post(
  '/:username/algorithms',
  validateJWT,
  async (request, response) =>
    userAlgorithmsPoster.handleRequest(request, response),
);

router.get(
  '/:username/algorithms/public',
  async (request, response) => {
    const algorithms = await userDatabase.getUserAlgorithms(
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
  },
);

export { router };
