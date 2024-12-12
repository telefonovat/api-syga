import { userDatabase } from '#src/services/database';
import jwt from 'jsonwebtoken';
import { AbstractController } from '../abstract-controller';
import { config } from '#src/config';
import {
  User,
  UserLoginInfo,
} from '#src/shared-types/user/Authentication';

interface UserJWT {
  username: User['username'];
  role: User['role'];
}

class UserLoginController implements AbstractController {
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

export const userLoginController = new UserLoginController();
