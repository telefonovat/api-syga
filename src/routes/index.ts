import { router as algorithmsRouter } from './algorithms.route';
import { router as usersRouter } from './users.route';
import { router as userRouter } from './user.route';

import { algorithmRouter } from './algorithmRouter';
import express from 'express';

const router = express.Router();

router.use('/algorithm', algorithmRouter);
router.use('/algorithms', algorithmsRouter);

router.use('/user', userRouter);
router.use('/users', usersRouter);
export { router };
