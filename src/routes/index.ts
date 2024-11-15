import { router as algorithmExecuteRouter } from './algorithm.execute.route';
import { router as databaseRouter } from './database.algorithms.route';
import { router as userRouter } from './users.route';
import express from 'express';

const router = express.Router();

// router.use('/community/algorithms', databaseRouter);
router.use('/algorithm/execute', algorithmExecuteRouter);
router.use('/login', userRouter);

export { router };
