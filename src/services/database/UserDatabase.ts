import mongoose from 'mongoose';
import { DatabaseError } from '../../errors/DatabaseErrors';
import { UnimplementedError } from '../../errors/UtilityErrorTypes';
import { config } from '../../config';

import { User, UserModel } from './schemas/UserSchema';

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
export class UserDatabase {
  private databaseUrl_: string;
  private isInitialized_: boolean = false;

  constructor(databaseUrl: string) {
    this.databaseUrl_ = databaseUrl;

    if (!this.databaseUrl_) {
      throw new Error('Mongodb connection string is empty...');
    }
    console.log(`URL: ${this.databaseUrl_}`);
  }

  async initialize(dbName: string) {
    if (this.isInitialized_) {
      return;
    }
    try {
      mongoose.connect(this.databaseUrl_, {
        dbName: dbName,
      });
      console.log(`Successfully connected to ${config.DB_NAME}`);
      this.isInitialized_ = true;
    } catch (error: any) {
      console.error(`Trouble initializing UserDatabase : ${error}`);
    }
  }

  async createUser(user: User) {
    const { username, email, role } = user;

    if (!this.isUsernameFree(username)) {
      throw new DatabaseError(
        'User creation failed : name is taken.',
      );
    }
    if (!this.isEmailFree(email)) {
      throw new DatabaseError(
        'User creation failed : email is taken',
      );
    }

    const mongooseUser = new UserModel(user);

    try {
      await mongooseUser.save();
      console.log('User saved!');
    } catch (e: any) {
      throw new Error('User save failed!');
    }
  }

  private async isUsernameFree(username: string): Promise<boolean> {
    const user = await UserModel.findOne({
      username: username,
    });
    if (user) {
      return false;
    }
    return true;
  }

  private async isEmailFree(email: string): Promise<boolean> {
    const user = await UserModel.findOne({
      email: email,
    });

    if (user) {
      return false;
    }

    return true;
  }
}
