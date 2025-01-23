import { userDatabase } from '#src/services/database';
import { AbstractController } from '../AbstractController';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Algorithm } from '#src/shared-types/user/Algorithm';

export default class MyAccountInfoController extends AbstractController {
  async handleGetAlgorithmsRequest(
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

  async handlePostAlgorithmRequest(
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
