import mongoose from 'mongoose';
import { DatabaseError } from '../../errors/DatabaseErrors';
import { UnimplementedError } from '../../errors/UtilityErrorTypes';
import { config } from '../../config';
import util from 'util';

import { UserModel } from './schemas/UserSchema';
import { User } from '#src/shared-types/user/Authentication';
import { Algorithm } from '#src/shared-types/user/Algorithm';
import { AlgorithmModel } from './schemas/AlgorithmSchema';

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
    } catch (error: any) {
      throw error;
    }
  }

  async getUser(username: string): Promise<User> {
    const userInDb = await UserModel.findOne({
      username: username,
    });
    if (!userInDb) {
      throw new Error('No such user in database');
    }
    return userInDb.toObject() as User;
  }

  async saveAlgorithm(algorithm: Algorithm): Promise<void> {
    const algorithmInDb = new AlgorithmModel(algorithm);
    await algorithmInDb.save();

    const username = algorithm.creatorUsername;
    await UserModel.updateOne(
      {
        username: username,
      },
      {
        $push: {
          algorithmIds: algorithm.uuid,
        },
      },
    );
  }
  async getAlgorithm(uuid: string): Promise<Algorithm> {
    const result = await AlgorithmModel.findOne({
      uuid: uuid,
    });
    if (!result) {
      throw new DatabaseError(
        `Cannot find algorithm with uuid ${uuid}`,
      );
    }

    return result;
  }

  async getUserAlgorithms(username: string): Promise<Algorithm[]> {
    const result = await UserModel.findOne(
      {
        username: username,
      },
      {
        algorithmIds: 1,
        _id: 0,
      },
    ).lean();
    if (!result) {
      throw new DatabaseError(
        `Cannot retrieve algorithms for ${username}`,
      );
    }

    const { algorithmIds } = result;

    const algorithms: Algorithm[] = await AlgorithmModel.find(
      {
        uuid: { $in: algorithmIds },
      },
      {
        _id: 0,
        __v: 0,
      },
    ).lean();

    return algorithms;
  }

  async checkPassword(
    candidateUser: Pick<User, 'username' | 'password'>,
  ): Promise<boolean> {
    const mongooseUser = new UserModel(candidateUser);
    const userInDb = await UserModel.findOne({
      username: candidateUser.username,
    });
    if (!userInDb) {
      throw new Error('User does not exist');
    }
    console.log(
      `candidate is ${util.inspect(candidateUser, { depth: 5 })}`,
    );
    return mongooseUser.comparePasswords(
      candidateUser.password,
      userInDb.password,
    );
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
