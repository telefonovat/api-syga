import { userDatabase } from '#src/services/database';
import { User } from '#src/services/database/schemas/UserSchema';
import jwt from 'jsonwebtoken';
import { AbstractController } from '../abstract-controller';

interface UserJWT {
  username: User['username'];
  role: User['role'];
}
class UserLoginController implements AbstractController {
  async login(user: User) {
    if (!userDatabase.checkPassword(user)) {
      throw new Error('Log in unsuccessful');
    }
    const payload: UserJWT = {
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, 'hiiamphone');

    return token;
  }
}

export const userLoginController = new UserLoginController();
