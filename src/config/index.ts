const config = {
  PORT: process.env.PORT || 8100,
  ENGINE_IMAGE: process.env.ENGINE_IMAGE || 'syga/engine',
  DB_NAME: process.env.DB_NAME || 'syga-test',
};

export { config };
