import express, { request } from 'express';
import { userDatabase } from '#src/services/database';

import { validateJWT } from '#src/middleware';
import { APIResponse } from '@telefonovat/syga--contract';
import {
  userAuthenticationController,
  userSearchController,
} from '#src/controllers/users';

const router = express.Router();

// Accepts every field from UserSchema except role
// The role is assigned on the server side
router.post('/register', async (request, response) =>
  userAuthenticationController.handleRegisterRequest(
    request,
    response,
  ),
);

//Accepts username and password
router.post('/login', async (request, response) =>
  userAuthenticationController.handleLoginRequest(request, response),
);

router.post('/search', async (request, response) =>
  userSearchController.handleSearchRequest(request, response),
);

export { router };
