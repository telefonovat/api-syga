import { algorithmDetailRouter } from './algorithmDetailRouter';
import express from 'express';
import { githubAlgorithmsRouter } from './githubAlgorithmsRouter';

const router = express.Router();

router.use('/algorithm', algorithmDetailRouter);
router.use('/readymade', githubAlgorithmsRouter);

export { router };
