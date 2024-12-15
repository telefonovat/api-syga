import { UserCodesController } from './user-codes';
import { UserLoginController } from './user-login-controller';
import { UserRegistrationController } from './user-registration-controller';

const userLoginController = new UserLoginController();
const userRegistrationController = new UserRegistrationController();
const userCodesController = new UserCodesController();

export {
  userLoginController,
  userRegistrationController,
  userCodesController,
};
