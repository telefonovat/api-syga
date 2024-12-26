import { UserAlgorithmsGetter } from './user-algorithms-getter';
import { UserAlgorithmsDeleter } from './user-algorithms-deleter';
import { UserAlgorithmsPoster } from './user-algorithms-poster';
import { UserLoginController } from './user-login-controller';
import { UserRegistrationController } from './user-registration-controller';

const userLoginController = new UserLoginController();
const userRegistrationController = new UserRegistrationController();
const userAlgorithmsGetter = new UserAlgorithmsGetter();
const userAlgorithmsPoster = new UserAlgorithmsPoster();
const userAlgorithmsDeleter = new UserAlgorithmsDeleter();

export {
  userLoginController,
  userRegistrationController,
  userAlgorithmsGetter,
  userAlgorithmsPoster,
  userAlgorithmsDeleter,
};
