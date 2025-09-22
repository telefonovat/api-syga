function loadDatabaseConfig() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not configured');
  }
  if (!process.env.MONGODB_DATABASE_NAME) {
    throw new Error('MONGODB_DATABASE_NAME not configured');
  }

  // MongoDB collection config
  if (!process.env.ALGORITHMS_COLLECTION_NAME) {
    throw new Error('ALGORITHMS_COLLECTION_NAME not configured');
  }
  if (!process.env.USERS_COLLECTION_NAME) {
    throw new Error('USERS_COLLECTION_NAME not configured');
  }

  return {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
    ALGORITHMS_COLLECTION_NAME:
      process.env.ALGORITHMS_COLLECTION_NAME,
    USERS_COLLECTION_NAME: process.env.USERS_COLLECTION_NAME,
  };
}
export const databaseConfig = loadDatabaseConfig();
