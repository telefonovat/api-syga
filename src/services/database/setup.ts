import { Db, MongoClient } from 'mongodb';
import { databaseConfig } from './config';

let db: Db | undefined;

export async function connectToDatabase() {
  if (db !== undefined) {
    return;
  }
  const dbName: string = databaseConfig.MONGODB_DATABASE_NAME;
  const uri: string = databaseConfig.MONGODB_URI;

  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log(`[LOG] connected to MongoDB database at ${dbName}`);
}

export function getDb() {
  if (!db) {
    throw new Error('Mongodb database is not initialized');
  }
  return db;
}
