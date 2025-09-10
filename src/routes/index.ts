import { router as algorithmsRouter } from './algorithms.route';
import { router as usersRouter } from './users.route';
import { router as userRouter } from './user.route';

import { algorithmRouter } from './algorithmRouter';
import { authRouter } from './authRouter';
import express from 'express';
import { userDataRouter } from './userDataRouter';

const router = express.Router();

router.use('/algorithm', algorithmRouter);
router.use('', authRouter);
router.use('', userDataRouter);
// router.use('/algorithms', algorithmsRouter);

// router.use('/user', userRouter);
// router.use('/users', usersRouter);

router.post('/test', (request, response) => {
  response.statusCode = 200;
  response.send("That's all folks!");
});

router.get('/test', (request, response) => {
  response.statusCode = 200;
  response.send('What do you want?');
});
export { router };
