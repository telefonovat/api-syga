import { userDatabase } from '#src/services/database';
import jwt from 'jsonwebtoken';
import { AbstractController } from '../AbstractController';
import { config } from '#src/config';
import {
  User,
  UserLoginInfo,
} from '#src/shared-types/user/Authentication';
import { Request, Response } from 'express';

interface UserJWT {
  username: User['username'];
  role: User['role'];
}

export class UserLoginController extends AbstractController {
  async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const requestBody = request.body;
    const loginInfo = requestBody.content as UserLoginInfo;

    userDatabase
      .checkPassword(loginInfo)
      .then((isPasswordCorrect) => {
        if (!isPasswordCorrect) {
          this.sendError(response, 402, new Error('Wrong password'));
        } else {
          const payload: UserJWT = {
            username: loginInfo.username,
            role: 'student',
          };
          const token = jwt.sign(payload, config.JWT_SECRET!, {
            expiresIn: '3h',
          });

          this.sendResponse(response, 200, { token: token });
        }
      })
      .catch((error) => {
        console.log(error);
        this.sendError(response, 400, error);
      });
  }
  async login(loginInfo: UserLoginInfo) {
    if (!(await userDatabase.checkPassword(loginInfo))) {
      throw new Error('Wrong password');
    }
    const payload: UserJWT = {
      username: loginInfo.username,
      role: 'student',
    };
    const token = jwt.sign(payload, config.JWT_SECRET!, {
      expiresIn: '3h',
    });

    return token;
  }
}
