const config = {
  PORT: process.env.PORT || 8300,
  ENGINE_IMAGE: process.env.ENGINE_IMAGE || 'syga/engine',
  DB_NAME: process.env.DB_NAME || 'syga-test',

  SEQ_NAME: process.env.SEQ_NAME,
  SEQ_SERVER_URL: process.env.SEQ_SERVER_URL,
  SEQ_SERVER_API_KEY: process.env.SEQ_SERVER_API_KEY,
};

export { config };
