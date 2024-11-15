import { Database } from './UserDatabase';
import util from 'util';

interface RetrievalInfo {
  slug: string;
  version: string;
  namespace: string;
}
/*
 * Retrieves Algorithms from MongoDB Database
 */
export class AlgorithmRetriever {
  private database_: Database;

  private static ALGORITHM_COLLECTION: string = 'algorithms';

  constructor(database: Database) {
    this.database_ = database;
  }

  async retrieveOne(
    retrievalInfo: RetrievalInfo,
    collectionName: string = AlgorithmRetriever.ALGORITHM_COLLECTION,
  ): Promise<Document> {
    try {
      const collection = this.database_.getCollection(collectionName);
      const algorithm = await collection.findOne(retrievalInfo);

      if (!algorithm) {
        throw new Error(
          `Algorithm not found : ${util.inspect(retrievalInfo)}`,
        );
      }
      return algorithm;
    } catch (error: any) {
      throw error;
    }
  }
}
