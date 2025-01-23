import { Request, Response } from 'express';
import { AbstractController } from '../AbstractController';
import { Algorithm } from '#src/shared-types/user/Algorithm';
import { userDatabase } from '#src/services/database';

import { v4 as uuidv4 } from 'uuid';

export class UserAlgorithmsPoster extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const username = response.locals.username;

    const algorithm = request.body.content as Omit<
      Algorithm,
      'uuid' | 'creatorUsername'
    >;

    if (!algorithm) {
      this.sendError(response, 403, new Error('No code attached'));
      return;
    }

    userDatabase
      .saveAlgorithm({
        uuid: uuidv4(),
        creatorUsername: username,
        ...algorithm,
      })
      .then(() => {
        this.sendResponse(response, 200);
      })
      .catch((error) => {
        this.sendError(response, 422, error);
      });
  }
}
