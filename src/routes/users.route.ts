import express from 'express';

const router = express.Router();

router.post('/', async (request, response) => {
  response.sendStatus(404);
});

export { router };
