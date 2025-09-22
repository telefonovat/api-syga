import { userDatabaseService } from '../database';

interface SignInPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  password: string;
  email: string;
}

export interface AuthService {
  isSignInValid(payload: SignInPayload): Promise<boolean>;
  registerUser(payload: RegisterPayload): void;
}

export const authService: AuthService = {
  async isSignInValid({ username, password }) {
    const user = await userDatabaseService.getUser(username);
    if (username === user.username && password === user.password) {
      console.log(
        `[LOG] user ${username} signed in successfully at ${new Date().toISOString()}`,
      );
      return true;
    }
    return false;
  },
  registerUser({ username, password }) {},
};
