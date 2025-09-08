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
  signInUser(payload: SignInPayload): void;
  registerUser(payload: RegisterPayload): void;
}

export const authService: AuthService = {
  signInUser(payload) {},
  registerUser(payload) {},
};
