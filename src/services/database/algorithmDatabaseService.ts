import {
  SygaAlgorithm,
  SygaAlgorithmPublicData,
} from '@telefonovat/syga--contract';
import { getDb } from './setup';

interface AlgorithmDatabaseService {
  ownsAlgorithm(username: string, uuid: string): Promise<boolean>;
  isAlgorithmPublic(uuid: string): Promise<boolean>;
  getAlgorithmDetail(uuid: string): Promise<SygaAlgorithmPublicData>;
}

export const algorithmDatabaseService: AlgorithmDatabaseService = {
  async ownsAlgorithm(username, uuid): Promise<boolean> {
    const db = getDb();
    const algorithm = await db
      .collection('algorithms')
      .findOne({ uuid: uuid });
    if (!algorithm) {
      console.log(
        `[LOG] Tried looking up algorithm with uuid ${uuid} but found none`,
      );
      return false;
    }
    if (!algorithm.author) {
      console.log(`[LOG] Algorithm ${uuid} is missing author`);
      return false;
    }

    return algorithm.author === username;
  },
  async isAlgorithmPublic(uuid): Promise<boolean> {
    return true;
  },
  async getAlgorithmDetail(uuid): Promise<SygaAlgorithmPublicData> {
    const db = getDb();
    const algorithm = await db
      .collection('algorithms')
      .findOne({ uuid: uuid });

    if (!algorithm) {
      console.log(
        `[LOG] Attempted to look up algorithm ${uuid} but failed`,
      );
      throw new Error('Algorithm not found');
    }

    //TODO: Better type validation
    const publicView: SygaAlgorithmPublicData = {
      uuid: algorithm.uuid,
      author: algorithm.author,
      name: algorithm.name,
      slug: algorithm.slug,
      code: algorithm.code,
      createdAtIso: algorithm.createdAtIso,
    };
    return publicView;
  },
};
