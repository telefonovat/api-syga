import { RegisterFormData } from 'src/shared-types/user/Authentication';
export class RegisterFormToUserConverter {
  static convert(registerData: RegisterFormData): User {}
}
