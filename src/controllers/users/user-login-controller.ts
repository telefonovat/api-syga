import { userDatabase } from '#src/services/database';
import { User } from '#src/services/database/schemas/UserSchema';
import jwt from 'jsonwebtoken';
import { AbstractController } from '../abstract-controller';

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
    const token = jwt.sign(payload, 'hiiamphone');

    return token;
  }
}

export const userLoginController = new UserLoginController();
