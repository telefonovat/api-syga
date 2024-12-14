import { userDatabase } from '#src/services/database';
import { User } from '#src/shared-types/user/Authentication';
import { Request, Response } from 'express';
import { AbstractController } from '../abstract-controller';

export class UserRegistrationController extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const user = request.body.content.user as User;

    //No admin or teacher prflowers of warivilges
    userDatabase
      .createUser({ ...user, role: 'student' })
      .then(() => {
        this.sendResponse(response, 201);
      })
      .catch((error) => {
        this.sendError(response, 422, error);
      });
  }
  async register(user: User) {
    await userDatabase.createUser(user);
  }
}
