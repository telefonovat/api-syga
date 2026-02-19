import { algorithmDetailRouter } from './algorithmDetailRouter';
import { githubAlgorithmsRouter } from './githubAlgorithmsRouter';
import { fetchCodeFromGithub } from '#src/services/fetchSources/fetchCodeFromGitHub.js';

import express from 'express';

const router = express.Router();

router.use('/algorithm', algorithmDetailRouter);
router.use('/readymade', githubAlgorithmsRouter);

router.get(
  '/v2/algorithm/:path(*)',
  async function (request, response) {
    try {
      const path = request.params.path;
      const code = await fetchCodeFromGithub(path);

      response.status(200).send({
        code,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        response.status(400).send({ error: e.message });
      } else {
        response.status(500).send({
          error:
            'An unknown error occured while trying to fetch algorithm',
        });
      }
    }
  },
);

router.get('/v2/ping', (_, response) =>
  response.send('Ping succeeded.'),
);

export { router };
