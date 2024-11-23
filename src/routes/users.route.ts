import express from 'express';
import { userDatabase } from '../services/database';
import { User } from '../services/database/UserDatabase';

const router = express.Router();

router.post('/register', async (request, response) => {
  console.log(`Registering : ${request.body.user}`);
  await userDatabase.initialize();
  await userDatabase.createUser(request.body.user as User);
});

export { router };
