import {
  SygaAlgorithmIdentifier,
  SygaAlgorithmCreateParams,
  SygaAlgorithm,
} from '@telefonovat/syga--contract';
import { getDb } from './setup';
import { PushOperator } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

interface UserDatabaseService {
  userExists(username: string): Promise<boolean>;
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
    const userUpdateResult = await db.collection('users').updateOne(
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
      createdAtIso: now,
      lastUpdatedAtIso: now,
    };

    const algorithmLookUpResult = await db
      .collection('algorithms')
      .findOne({ uuid: algorithmIdentifier.uuid });
    if (algorithmLookUpResult) {
      console.warn(
        `[WARN] algorithm creation failed as algorithm with uuid ${algorithmIdentifier.uuid} already exists`,
      );
      throw new Error('Algorithm creation failed');
    }

    const _algorithmAddResult = await db
      .collection('algorithms')
      .insertOne(algorithmRecord);

    return algorithmIdentifier;
  },
};
