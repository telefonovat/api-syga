const config = {
  PORT: process.env.API_PORT || 8100,
  ENGINE_IMAGE: process.env.ENGINE_IMAGE || 'syga/engine',
  MONGODB_URL:
    process.env.MONGODB_URL ||
    'mongodb+srv://kheltan:aPepj6QfoOmLTih3@syga-test.zlpph.mongodb.net/?retryWrites=true&w=majority&appName=syga-test',
  DB_NAME: process.env.DB_NAME || 'syga-test',
  JWT_SECRET: process.env.JWT_SECRET || 'phone',
};

export { config };
