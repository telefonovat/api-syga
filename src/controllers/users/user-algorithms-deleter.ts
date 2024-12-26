import { Request, Response } from 'express';
import { AbstractController } from '../abstract-controller';
import { userDatabase } from '#src/services/database';
export class UserAlgorithmsDeleter extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const loggedInUsername = response.locals.username;
    const algorithmUuid = request.params.uuid;

    try {
      const algorithm =
        await userDatabase.getAlgorithm(algorithmUuid);
      if (
        !loggedInUsername ||
        algorithm.creatorUsername !== loggedInUsername
      ) {
        this.sendError(response, 401);
        return;
      }
    } catch (error: any) {
      console.log(error);
      this.sendError(response, 400, error);
      return;
    }

    userDatabase
      .deleteAlgorithm(algorithmUuid)
      .then(() => this.sendResponse(response, 200))
      .catch((error) => this.sendError(response, 404, error));
  }
}
