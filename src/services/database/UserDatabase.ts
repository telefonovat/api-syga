import { Schema, model, connect } from 'mongoose';
import { DatabaseError } from 'src/errors/DatabaseErrors';
import { UnimplementedError } from 'src/errors/UtilityErrorTypes';

const userRoles = ['student', 'admin'] as const;

interface User {
  name: string;
  email: string;
  role: (typeof userRoles)[number];
}

//REMINDER: Mongoose adds an _id field by default
const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: userRoles,
  },
});

const UserModel = model<User>('User', userSchema);

/*
 * DEV_INTENT:
 * Should handle
 *   - Database connection
 *   - All atomic operations
 *     + Create user
 *        - Check if name and email are free
 *        - Check if role is appropriate
 *        - Hash password
 *        - Save password and User Data to DB
 *        - Automatic log in(?)
 *     + Log in
 *        - Check if username exists
 *        - Check if hashed passwords match
 *        - What to do after this?
 *   - concerns
 *    + multiple concurrent logins
 */
class UserDatabase {
  private databaseUrl_;
  constructor(databaseUrl: string) {
    this.databaseUrl_ = databaseUrl;
  }

  async createUser(user: User) {
    const { name, email, role } = user;

    if (!this.isNameFree(name)) {
      throw new DatabaseError(
        'User creation failed : name is taken.',
      );
    }
    if (!this.isEmailFree(email)) {
      throw new DatabaseError(
        'User creation failed : email is taken',
      );
    }
  }

  private isNameFree(name: string): boolean {
    throw new UnimplementedError('isNameFree is Unimplemented');
  }

  private isEmailFree(email: string): boolean {
    throw new UnimplementedError('isEmailFree is Unimplemented');
  }
}
