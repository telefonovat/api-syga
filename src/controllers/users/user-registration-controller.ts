import { userDatabase } from '../../services/database';
import { User } from '../../services/database/UserDatabase';
import { AbstractController } from '../abstract-controller';

class UserRegistrationController implements AbstractController {
  async register(user: User) {
    await userDatabase.createUser(user);
    console.log('Done');
  }
}

export const userRegistrationController =
  new UserRegistrationController();
