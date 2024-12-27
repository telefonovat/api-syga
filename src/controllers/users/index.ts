import { UserAlgorithmsGetter } from './user-algorithms-getter';
import { UserAlgorithmsDeleter } from './user-algorithms-deleter';
import { UserAlgorithmsPoster } from './user-algorithms-poster';
import { UserLoginController } from './user-login-controller';
import { UserRegistrationController } from './user-registration-controller';
import { UserSearcher } from './user-searcher';
import { UserPublicAlgorithmsGetter } from './user-public-algorithms-getter';

const userLoginController = new UserLoginController();
const userRegistrationController = new UserRegistrationController();
const userAlgorithmsGetter = new UserAlgorithmsGetter();
const userPublicAlgorithmsGetter = new UserPublicAlgorithmsGetter();
const userAlgorithmsPoster = new UserAlgorithmsPoster();
const userAlgorithmsDeleter = new UserAlgorithmsDeleter();
const userSearcher = new UserSearcher();

export {
  userLoginController,
  userRegistrationController,
  userAlgorithmsGetter,
  userPublicAlgorithmsGetter,
  userAlgorithmsPoster,
  userAlgorithmsDeleter,
  userSearcher,
};
