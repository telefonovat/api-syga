import {
  userPublicAlgorithmsGetter,
  myAccountInfoController,
} from '#src/controllers/users';
import { validateJWT } from '#src/middleware';
import express from 'express';

const router = express.Router();

/*
 * @deprecated
 */
router.get(
  '/:username/algorithms',
  validateJWT,
  (request, response) =>
    myAccountInfoController.handleGetAlgorithmsRequest(
      request,
      response,
    ),
);

/*
 * @deprecated
 */
router.get('/:username/algorithms/public', (request, response) =>
  userPublicAlgorithmsGetter.handleRequest(request, response),
);

/*
 * @deprecated
 */
router.post(
  '/:username/algorithms',
  validateJWT,
  async (request, response) =>
    myAccountInfoController.handlePostAlgorithmRequest(
      request,
      response,
    ),
);

export { router };
