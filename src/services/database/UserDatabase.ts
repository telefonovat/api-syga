import mongoose, { Schema, model, connect } from 'mongoose';
import { DatabaseError } from '../../errors/DatabaseErrors';
import { UnimplementedError } from '../../errors/UtilityErrorTypes';
import util from 'util';
import { config } from '../../config';

const userRoles = ['student', 'admin'] as const;

export interface User {
  username: string;
  email: string;
  role: (typeof userRoles)[number];
}

//REMINDER: Mongoose adds an _id field by default
const userSchema = new Schema<User>(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: userRoles,
    },
  },
  { collection: 'users' },
);

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
export class UserDatabase {
  private databaseUrl_: string;
  private isInitialized_: boolean = false;
  constructor(databaseUrl: string) {
    this.databaseUrl_ = databaseUrl;

    if (!this.databaseUrl_) {
      throw new Error('Mongodb connection string is empty...');
    }
    console.log(`URL: ${this.databaseUrl_}`);
    // mongoose
    //   .connect(this.databaseUrl_, {
    //     dbName: config.DB_NAME,
    //   })
    //   .then(() => {
    //     console.log('Connected...');
    //
    //     const user = new UserModel({
    //       username: 'Jack',
    //       email: 'jack@gmail.com',
    //       role: 'student',
    //     });
    //
    //     user
    //       .save()
    //       .then(() => console.log('Saved!'))
    //       .catch((error) =>
    //         console.warn(`User save failed : ${error}`),
    //       );
    //   })
    //   .catch((error) =>
    //     console.warn(
    //       `Connection failed :  ${error} -> ${this.databaseUrl_}`,
    //     ),
    //   );
  }
  async initialize() {
    if (this.isInitialized_) {
      return;
    }
    try {
      mongoose.connect(this.databaseUrl_, {
        dbName: config.DB_NAME,
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
    console.log(util.inspect(user, { depth: 10 }));

    mongooseUser
      .save()
      .then(() => console.log('User successfully saved'));
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
