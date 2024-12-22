import {
  algorithmGetter,
  algorithmUpdater,
} from '#src/controllers/algorithm';
import { config } from '#src/config';
import { validateJWT } from '#src/middleware';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

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

router.get('/detail/:uuid', checkForJWT, (request, response) =>
  algorithmGetter.handleRequest(request, response),
);

router.put('/detail/:uuid', checkForJWT, (request, response) =>
  algorithmUpdater.handleRequest(request, response),
);

export { router };
