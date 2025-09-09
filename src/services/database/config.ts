function loadDatabaseConfig() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not configured');
  }
  if (!process.env.MONGODB_DATABASE_NAME) {
    throw new Error('MONGODB_DATABASE_NAME not configured');
  }

  return {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
  };
}
export const databaseConfig = loadDatabaseConfig();
