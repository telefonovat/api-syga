import { UserCodesController } from './user-codes';
import { UserCodesDeleter } from './user-codes-deleter';
import { UserCodesPoster } from './user-codes-poster';
import { UserLoginController } from './user-login-controller';
import { UserRegistrationController } from './user-registration-controller';

const userLoginController = new UserLoginController();
const userRegistrationController = new UserRegistrationController();
const userCodesController = new UserCodesController();
const userCodesPoster = new UserCodesPoster();
const userCodesDeleter = new UserCodesDeleter();

export {
  userLoginController,
  userRegistrationController,
  userCodesController,
  userCodesPoster,
  userCodesDeleter,
};
