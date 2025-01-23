import { userDatabase } from '#src/services/database';
import { AbstractController } from '../AbstractController';
import { Request, Response } from 'express';

export default class UserSearchController extends AbstractController {
  async handleSearchRequest(
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
