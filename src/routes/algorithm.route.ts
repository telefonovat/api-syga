/*
 * Route handlers dealing with logic concerning a single algorithm
 * identified by some uuid
 */

import express, { NextFunction, Request, Response } from 'express';
import { algorithmExecuteController } from '#src/controllers/algorithm';
import jwt from 'jsonwebtoken';
import { config } from '#src/config';

const router = express.Router();

/*
 * @deprecated
 * Execute Python code sent from browser
 *
 */
router.post('/execute', async (request, response) =>
  algorithmExecuteController.handleExecuteRequest(request, response),
);

const checkForJWT = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authorizationHeader = request.get('Authorization');
    if (authorizationHeader === undefined) {
      response
        .status(400)
        .json({ success: false, message: 'No JWT token found' });
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    const { username } = jwt.verify(token, config.JWT_SECRET!) as {
      username: string;
      role: 'student' | 'admin';
    };

    response.locals.username = username;
    next();
  } catch (error: any) {
    response.status(401).json({
      success: false,
      message: 'Unknown error while decrypting JWT',
    });
    return;
  }
};
