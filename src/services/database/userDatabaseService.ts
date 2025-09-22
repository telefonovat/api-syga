import {
  SygaAlgorithmIdentifier,
  SygaAlgorithmCreateParams,
  SygaAlgorithm,
  UserSchema,
  User,
} from '@telefonovat/syga--contract';
import { getDb } from './setup';
import { PushOperator } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { databaseConfig } from './config';
import z from 'zod';

interface UserDatabaseService {
  userExists(username: string): Promise<boolean>;
  getUser(username: string): Promise<User>;
  getAlgorithms(username: string): Promise<SygaAlgorithmIdentifier[]>;
  addAlgorithms(
    username: string,
    algorithms: SygaAlgorithmCreateParams[],
  ): Promise<SygaAlgorithmIdentifier[]>;
  createAlgorithm(
    username: string,
    algorithm: SygaAlgorithmCreateParams,
  ): Promise<SygaAlgorithmIdentifier>;
}

export const userDatabaseService: UserDatabaseService = {
  async userExists(username: string): Promise<boolean> {
    const user = await getDb()
      .collection(databaseConfig.USERS_COLLECTION_NAME)
      .findOne({ username });
    return user !== null;
  },
  async getUser(username: string): Promise<User> {
    const user = await getDb()
      .collection(databaseConfig.USERS_COLLECTION_NAME)
      .findOne({ username });
    if (user === null) {
      console.log(`[LOG] Failed to find user ${username}`);
      throw new Error(`Unable to find user ${username}`);
    }

    try {
      const validatedUser = UserSchema.parse(user);
      return validatedUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(
          `[LOG] Zod validation of user object ${username} from DB failed`,
        );
      }

      throw error;
    }
  },
  async getAlgorithms(username): Promise<SygaAlgorithmIdentifier[]> {
    const user = await getDb()
      .collection(databaseConfig.USERS_COLLECTION_NAME)
      .findOne(
        { username },
        { projection: { algorithms: 1, _id: 0 } },
      );

    if (!user) {
      console.warn(
        `[WARN] there is no user with the name ${username}`,
      );
      return [];
    }

    //TODO: Better type validation
    const algorithms = user.algorithms ?? [];

    return algorithms;
  },
  async addAlgorithms(
    username,
    algorithms,
  ): Promise<SygaAlgorithmIdentifier[]> {
    const algorithmIdentifiers = Promise.all(
      algorithms.map((algorithm) =>
        this.createAlgorithm(username, algorithm),
      ),
    );
    return algorithmIdentifiers;
  },
  async createAlgorithm(
    username: string,
    algorithmParams: SygaAlgorithmCreateParams,
  ): Promise<SygaAlgorithmIdentifier> {
    const db = getDb();

    const algorithmUuid = uuidv4();
    const algorithmIdentifier: SygaAlgorithmIdentifier = {
      uuid: algorithmUuid,
      name: algorithmParams.name,
    };

    const userUpdateResult = await db
      .collection(databaseConfig.USERS_COLLECTION_NAME)
      .updateOne(
        { username },
        {
          $push: {
            algorithms: algorithmIdentifier,
          } as unknown as PushOperator<Document>,
        },
      );

    if (userUpdateResult.matchedCount === 0) {
      console.warn(
        `[WARN] algorithm creation failed as we could not find username ${username}`,
      );
      throw new Error('Algorithm creation failed');
    }

    //TODO: Actually add the code to algorithms
    const now = new Date().toISOString();
    const slug = algorithmIdentifier.name
      .toLowerCase()
      // strips unsafe characters
      .replace(/[^\w\s\']|_/g, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .join('-');
    const algorithmRecord: SygaAlgorithm = {
      ...algorithmIdentifier,
      slug: slug,
      code: algorithmParams.code,
      author: username,
      isPublic: algorithmParams.isPublic,
      createdAtIso: now,
      lastUpdatedAtIso: now,
    };

    const algorithmLookUpResult = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
      .findOne({ uuid: algorithmIdentifier.uuid });
    if (algorithmLookUpResult) {
      console.warn(
        `[WARN] algorithm creation failed as algorithm with uuid ${algorithmIdentifier.uuid} already exists`,
      );
      throw new Error('Algorithm creation failed');
    }

    const _algorithmAddResult = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
      .insertOne(algorithmRecord);

    return algorithmIdentifier;
  },
};
