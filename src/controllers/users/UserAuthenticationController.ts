import { userDatabase } from '#src/services/database';
import { User, UserLoginInfo } from '@telefonovat/syga--contract';
import { AbstractController } from '../AbstractController';
import { Request, Response } from 'express';
import { config } from '#src/config';
import jwt from 'jsonwebtoken';

interface UserJWT {
  username: User['username'];
  role: User['role'];
}
export default class UserAuthenticationController extends AbstractController {
  async handleLoginRequest(
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

  async handleRegisterRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    const user = request.body.content as User;

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
