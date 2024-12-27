import { Request, Response } from 'express';
import { AbstractController } from '../abstract-controller';
import { userDatabase } from '#src/services/database';

export class UserPublicAlgorithmsGetter extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const username = request.params.username;

    if (!username) {
      throw new Error('Username missing');
    }

    userDatabase
      .getUserAlgorithmsPublic(username)
      .then((publicAlgorithms) => {
        this.sendResponse(response, 200, publicAlgorithms);
      })
      .catch((error) => this.sendError(response, 400, error));
  }
}
