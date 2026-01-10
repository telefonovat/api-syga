import { algorithmDetailRouter } from './algorithmDetailRouter';
import { authRouter } from './authRouter';
import express from 'express';
import { userDataRouter } from './userDataRouter';
import { algorithmsRouter } from './algorithmsRouter';
import { githubAlgorithmsRouter } from './githubAlgorithmsRouter';

const router = express.Router();

router.use('/algorithm', algorithmDetailRouter);
router.use('/algorithms', algorithmsRouter);
router.use('', authRouter);
router.use('', userDataRouter);
router.use('/readymade', githubAlgorithmsRouter);

router.post('/test', (request, response) => {
  response.statusCode = 200;
  response.send("That's all folks!");
});

router.get('/test', (request, response) => {
  response.statusCode = 200;
  response.send('What do you want?');
});
export { router };
