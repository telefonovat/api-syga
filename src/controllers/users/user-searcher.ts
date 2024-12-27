import { Request, Response } from 'express';
import { AbstractController } from '../abstract-controller';
import { userDatabase } from '#src/services/database';

export class UserSearcher extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const nameToSearch = request.body.content as string;

    userDatabase
      .searchUsers(nameToSearch)
      .then((users) => {
        this.sendResponse(response, 200, users);
      })
      .catch((error) => this.sendError(response, 400));
  }
}
