import express from 'express';
import { userDatabase } from '#src/services/database';

import { validateJWT } from '#src/middleware';
import { APIResponse } from '#src/shared-types/APIResponse';
import {
  userCodesController,
  userCodesPoster,
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

router.get('/:username/codes', validateJWT, (request, response) =>
  userCodesController.handleRequest(request, response),
);
router.post(
  '/:username/codes',
  validateJWT,
  async (request, response) =>
    userCodesPoster.handleRequest(request, response),
);

router.get('/:username/codes/public', async (request, response) => {
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
});

// router.get('/:username', validateJWT, async (request, response) => {
//   const username = response.locals.username;
//   userDatabase
//     .getUser(username)
//     .then((user) => {
//       const successResponse: APIResponse = {
//         success: true,
//         message: '',
//         content: {
//           user: user,
//         },
//       };
//       response.status(200).json(successResponse);
//     })
//     .catch((error) => {
//       const failureResponse: APIResponse = {
//         success: false,
//         message: '',
//         errors: error,
//       };
//       response.status(404).json(failureResponse);
//     });
// });

export { router };
