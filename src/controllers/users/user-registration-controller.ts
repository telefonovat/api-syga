import { userDatabase } from '#src/services/database';
import { User } from '#src/shared-types/user/Authentication';
import { AbstractController } from '../abstract-controller';

class UserRegistrationController implements AbstractController {
  async register(user: User) {
    await userDatabase.createUser(user);
  }
}

export const userRegistrationController =
  new UserRegistrationController();
