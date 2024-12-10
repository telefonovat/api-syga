import { userDatabase } from '#src/services/database';
import { User } from '#src/services/database/schemas/UserSchema';
import jwt from 'jsonwebtoken';
import { AbstractController } from '../abstract-controller';
import { config } from '#src/config';

interface UserJWT {
  username: User['username'];
  role: User['role'];
}
class UserLoginController implements AbstractController {
  async login(user: Pick<User, 'username' | 'password'>) {
    if (!(await userDatabase.checkPassword(user))) {
      throw new Error('Wrong password');
    }
    const payload: UserJWT = {
      username: user.username,
      role: 'student',
    };
    const token = jwt.sign(payload, config.JWT_SECRET!);

    return token;
  }
}

export const userLoginController = new UserLoginController();
