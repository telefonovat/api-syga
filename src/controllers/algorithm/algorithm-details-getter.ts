import { Request, Response } from 'express';
import { AbstractController } from '../abstract-controller';
import { userDatabase } from '#src/services/database';

export class AlgorithmDetailsGetter extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const algorithmUuid = request.params.uuid;

    if (!algorithmUuid) {
      throw new Error('No uuid in URL parameters!');
    }

    userDatabase
      .getAlgorithm(algorithmUuid)
      .then((algorithm) => {
        if (algorithm.isPublic) {
          this.sendResponse(response, 200, algorithm);
          return;
        }

        const loggedInUsername = response.locals.username;
        if (
          !loggedInUsername ||
          loggedInUsername !== algorithm.creatorUsername
        ) {
          this.sendError(
            response,
            401,
            new Error('You do not have access'),
          );
          return;
        }

        this.sendResponse(response, 200, algorithm);
      })
      .catch((error) => {
        this.sendError(response, 400, error);
      });
  }
}
