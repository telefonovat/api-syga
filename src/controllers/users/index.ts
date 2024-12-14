import { UserLoginController } from './user-login-controller';
import { UserRegistrationController } from './user-registration-controller';

const userLoginController = new UserLoginController();
const userRegistrationController = new UserRegistrationController();

export { userLoginController, userRegistrationController };
