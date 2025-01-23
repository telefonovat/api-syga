import {
  userAlgorithmsGetter,
  userPublicAlgorithmsGetter,
  userAlgorithmsPoster,
} from '#src/controllers/users';
import { validateJWT } from '#src/middleware';
import express from 'express';

const router = express.Router();
router.get(
  '/:username/algorithms',
  validateJWT,
  (request, response) =>
    userAlgorithmsGetter.handleRequest(request, response),
);

router.get('/:username/algorithms/public', (request, response) =>
  userPublicAlgorithmsGetter.handleRequest(request, response),
);
router.post(
  '/:username/algorithms',
  validateJWT,
  async (request, response) =>
    userAlgorithmsPoster.handleRequest(request, response),
);

export { router };
