import { Request, Response } from 'express';
import { AbstractController } from '../abstract-controller';
import { userDatabase } from '#src/services/database';
import { Algorithm } from '#src/shared-types/user/Algorithm';

export class AlgorithmDetailsUpdater extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const loggedInUsername = response.locals.username;
    const algorithmUuid = request.params.uuid;

    const algorithmUpdate: Partial<Algorithm> = request.body.content;

    if (!algorithmUpdate) {
      this.sendError(response, 400, new Error('Empty content'));
      return;
    }

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
      this.sendError(response, 400);
      return;
    }

    userDatabase
      .updateAlgorithm(algorithmUuid, algorithmUpdate)
      .then(() => {
        this.sendResponse(response, 200);
      })
      .catch((error) => {
        this.sendError(response, 400);
      });
  }
}
