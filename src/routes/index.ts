import { router as algorithmsRouter } from './algorithms.route';
import { router as userRouter } from './users.route';

import { router as singleAlgorithmRouter } from './single-algorithm.route';
import express from 'express';

const router = express.Router();

router.use('/algorithm', singleAlgorithmRouter);
router.use('/users', userRouter);
router.use('/algorithms', algorithmsRouter);

export { router };
