import { userDatabase } from '#src/services/database';
import { User } from '#src/services/database/schemas/UserSchema';
import { AbstractController } from '../abstract-controller';

class UserRegistrationController implements AbstractController {
  async register(user: User) {
    //Allow only student registration for now
    await userDatabase.createUser(user);
    console.log('Done');
  }
}

export const userRegistrationController =
  new UserRegistrationController();
