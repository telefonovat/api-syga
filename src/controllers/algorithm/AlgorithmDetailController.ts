import { Request, Response } from 'express';
import { AbstractController } from '../AbstractController';
import { userDatabase } from '#src/services/database';
import { Algorithm } from '@telefonovat/syga--contract';

export default class AlgorithmDetailController extends AbstractController {
  async handleGetRequest(
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

  async handleUpdateRequest(
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

  async handleDeleteRequest(
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
