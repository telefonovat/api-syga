import express, { json } from 'express';
import cors from 'cors';

import { config } from './config';

import { router } from './routes';
import { validateConfig } from './startup';
import { connect } from 'mongoose';
import { connectToDatabase } from './services/database';

validateConfig(config);

const app = express();

app.use(json());
app.use(cors());

app.use(router);

async function start() {
  await connectToDatabase();
  app.listen(config.PORT, () => {
    console.log(`[LOG] SYGA API listening on port ${config.PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});

export { app };
