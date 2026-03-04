import { algorithmDetailRouter } from './algorithmDetailRouter.js';
import { fetchCodeFromGithub } from '#src/services/fetchSources/fetchCodeFromGitHub.js';

import express from 'express';

const router = express.Router();

router.use('/algorithm', algorithmDetailRouter);

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

router.post('/v2/format', async (request, response) => {
  try {
    const body = request.body;
    if (!body.code) {
      response.status(400).send({ error: 'The request has no code' });
    }

    const code: string = body.code;

    const result = await fetch('http://nginx:80/engine/v1/format', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resultBody: any = await result.json();

    if (!resultBody.formatted_code) {
      response
        .status(500)
        .send({ error: 'The engine would not format the code.' });
    }

    response
      .status(200)
      .send({ formattedCode: resultBody.formatted_code });
  } catch (e) {
    if (e instanceof Error) {
      response.status(400).send({ error: e.message });
    } else {
      response.status(500).send({
        error:
          'An unknown error occured while trying to fetch algorithm',
      });
    }
  }
});

router.get('/v2/ping', (_, response) =>
  response.send('Ping succeeded.'),
);

export { router };
