import {
  SygaAlgorithmIdentifier,
  SygaAlgorithmPublicData,
  SygaAlgorithmUpdateParams,
} from '@telefonovat/syga--contract';
import { getDb } from './setup';
import { Document, PullOperator } from 'mongodb';
import { databaseConfig } from './config';

interface AlgorithmDatabaseService {
  ownsAlgorithm(username: string, uuid: string): Promise<boolean>;
  isAlgorithmPublic(uuid: string): Promise<boolean>;
  getAlgorithmDetail(uuid: string): Promise<SygaAlgorithmPublicData>;
  updateAlgorithm(
    uuid: string,
    updateParams: SygaAlgorithmUpdateParams,
  ): Promise<void>;
  deleteAlgorithm(uuid: string): Promise<void>;
}

export const algorithmDatabaseService: AlgorithmDatabaseService = {
  async ownsAlgorithm(username, uuid): Promise<boolean> {
    const db = getDb();
    const algorithm = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
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
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
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
  async updateAlgorithm(uuid, updateParams): Promise<void> {
    const db = getDb();
    const algorithm = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
      .findOne({ uuid: uuid });
    if (!algorithm) {
      console.log(`[LOG] No algorithm ${uuid} found`);
      return;
    }

    const author = algorithm.author;
    const recordUpdateResult = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
      .updateOne(
        { uuid: uuid },
        {
          $set: { ...updateParams },
        },
      );
    if (recordUpdateResult.modifiedCount === 0) {
      console.log(
        `[LOG] Attempted record update of algorithm ${uuid} but no such record was found`,
      );
      return;
    }

    if (updateParams.name !== undefined) {
      console.log('[LOG] Updating algorithm identifiers as well');
      const updatedIdentifier: SygaAlgorithmIdentifier = {
        isPublic: updateParams.isPublic ?? algorithm.isPublic,
        name: updateParams.name,
        uuid: uuid,
      };
      const identifierUpdateResult = await db
        .collection(databaseConfig.USERS_COLLECTION_NAME)
        .updateOne(
          { username: author, 'algorithms.uuid': uuid },
          {
            $set: {
              'algorithms.$': updatedIdentifier,
            },
          },
        );

      if (identifierUpdateResult.modifiedCount === 0) {
        console.log(
          `[LOG] Attempted identifier update of algorithm ${uuid} but no such identifier was found`,
        );
        return;
      }
    }
  },
  async deleteAlgorithm(uuid): Promise<void> {
    const db = getDb();
    const algorithm = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
      .findOne({ uuid: uuid });
    if (!algorithm) {
      console.log(`[LOG] No algorithm ${uuid} found`);
      return;
    }

    const author = algorithm.author as string;
    const recordDeleteResult = await db
      .collection(databaseConfig.ALGORITHMS_COLLECTION_NAME)
      .deleteOne({ uuid: uuid });

    if (recordDeleteResult.deletedCount === 0) {
      console.log(
        `[LOG] Attempted record deletion of algorithm ${uuid} but no such record was found`,
      );
    }

    const identifierDeleteResult = await db
      .collection(databaseConfig.USERS_COLLECTION_NAME)
      .updateOne(
        { username: author },
        {
          $pull: {
            algorithms: { uuid: uuid },
          } as unknown as PullOperator<Document>,
        },
      );

    if (identifierDeleteResult.modifiedCount === 0) {
      console.log(
        `[LOG] attempted deletion of algorithm id of ${uuid} for ${author} but failed`,
      );
    }
  },
};
