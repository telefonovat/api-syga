import { Request, Response } from 'express';
import { AbstractController } from '../AbstractController';
import { userDatabase } from '#src/services/database';

export class UserAlgorithmsGetter extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const username = request.params.username;
    userDatabase
      .getUserAlgorithms(username)
      .then((algorithms) => {
        this.sendResponse(response, 200, algorithms);
      })
      .catch((error) => {
        this.sendError(response, 400, error);
      });
  }
}
