import {
  SygaAlgorithmIdentifier,
  SygaAlgorithm,
} from '@telefonovat/syga--contract';
import { getDb } from './setup';
import { PushOperator } from 'mongodb';

interface UserDatabaseService {
  userExists(username: string): Promise<boolean>;
  getAlgorithms(username: string): Promise<SygaAlgorithmIdentifier[]>;
  createAlgorithm(
    username: string,
    algorithm: SygaAlgorithm,
  ): Promise<void>;
}

export const userDatabaseService: UserDatabaseService = {
  async userExists(username: string): Promise<boolean> {
    const user = await getDb()
      .collection('users')
      .findOne({ username });
    return user !== null;
  },
  async getAlgorithms(username): Promise<SygaAlgorithmIdentifier[]> {
    const user = await getDb()
      .collection('users')
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
    const algorithms = user.algorithms ?? [];

    return algorithms;
  },

  async createAlgorithm(username: string, algorithm: SygaAlgorithm) {
    const db = getDb();
    const algorithmIdentifier: SygaAlgorithmIdentifier = {
      uuid: algorithm.uuid,
      name: algorithm.name,
    };
    const result = await db.collection('users').updateOne(
      { username },
      {
        $push: {
          algorithms: algorithmIdentifier,
        } as unknown as PushOperator<Document>,
      },
    );

    if (result.matchedCount === 0) {
      console.warn(
        `[WARN] algorithm creation failed as we could not find username ${username}`,
      );
      return;
    }

    //TODO: Actually add the code to algorithms
  },
};
