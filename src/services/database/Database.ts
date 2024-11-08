import { Collection, Db, MongoClient } from 'mongodb';
import { uri } from './secret';

const DB_NAME: string = 'syga';

/*
 * DEV_INTENT:
 * Should handle
 *   - Database connection
 *   - All atomic operations
 *     + Updates
 *     + Add
 */
export class Database {
  private url_: string;
  private dbClient_: MongoClient;
  private database_: Db | null = null;

  constructor(url: string, database: string) {
    this.url_ = url;
    this.dbClient_ = new MongoClient(this.url_, {});
    this.initialize(database);
  }

  private async initialize(database: string) {
    await this.dbClient_.connect();
    this.database_ = this.dbClient_.db(DB_NAME);
  }

  getCollection(collectionName: string): Collection<Document> {
    if (!this.database_) {
      throw new Error('Database not connected');
    }

    return this.database_.collection(collectionName);
  }
  destroy() {
    this.dbClient_.close();
  }
}
