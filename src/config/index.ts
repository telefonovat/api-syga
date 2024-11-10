const config = {
  PORT: process.env.API_PORT || 6000,
  ENGINE_IMAGE: process.env.ENGINE_IMAGE || 'syga-backend',
};

export { config };
