import { SygaAlgorithmIdentifier } from '@telefonovat/syga--contract';
import { getDb } from './setup';

interface UserDatabaseService {
  getAlgorithms(username: string): Promise<SygaAlgorithmIdentifier[]>;
}

export const userDatabaseService: UserDatabaseService = {
  async getAlgorithms(username): Promise<SygaAlgorithmIdentifier[]> {
    const user = await getDb()
      .collection('users')
      .findOne(
        { username },
        { projection: { algorithms: 1, _id: 0 } },
      );

    if (!user) {
      console.log(`[LOG] there is no user with the name ${username}`);
      return [];
    }
    const algorithms = user.algorithms ?? [];

    return algorithms;
  },
};
