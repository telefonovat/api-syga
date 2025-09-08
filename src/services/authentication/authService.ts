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
  signInUser(payload: SignInPayload): boolean;
  registerUser(payload: RegisterPayload): void;
}

export const authService: AuthService = {
  signInUser(payload) {
    if (
      payload.username === 'phone' &&
      payload.password === 'phoneisawesome'
    ) {
      return true;
    }
    return false;
  },
  registerUser(payload) {},
};
