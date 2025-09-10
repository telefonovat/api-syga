import { algorithmDetailRouter } from './algorithmDetailRouter';
import { authRouter } from './authRouter';
import express from 'express';
import { userDataRouter } from './userDataRouter';
import { algorithmsRouter } from './algorithmsRouter';

const router = express.Router();

router.use('/algorithm', algorithmDetailRouter);
router.use('/algorithms', algorithmsRouter);
router.use('', authRouter);
router.use('', userDataRouter);

router.post('/test', (request, response) => {
  response.statusCode = 200;
  response.send("That's all folks!");
});

router.get('/test', (request, response) => {
  response.statusCode = 200;
  response.send('What do you want?');
});
export { router };
