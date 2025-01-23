import { router as algorithmsRouter } from './algorithms.route';
import { router as usersRouter } from './users.route';
import { router as userRouter } from './user.route';

import { router as singleAlgorithmRouter } from './algorithm.route';
import express from 'express';

const router = express.Router();

router.use('/algorithm', singleAlgorithmRouter);
router.use('/algorithms', algorithmsRouter);

router.use('/user', userRouter);
router.use('/users', usersRouter);
export { router };
