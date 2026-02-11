import { algorithmDetailRouter } from './algorithmDetailRouter';
import express from 'express';
import { githubAlgorithmsRouter } from './githubAlgorithmsRouter';

const router = express.Router();

router.use('/algorithm', algorithmDetailRouter);
router.use('/readymade', githubAlgorithmsRouter);

router.get('/v1/ping', (_, response) =>
  response.send('Ping succeeded.'),
);

export { router };
