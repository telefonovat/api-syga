const config = {
  PORT: process.env.API_PORT || 6000,
  ENGINE_IMAGE: process.env.ENGINE_IMAGE || 'syga/engine',
  MONGODB_URL: process.env.MONGODB_URL,
  DB_NAME: process.env.DB_NAME || 'syga-test',
};

export { config };
