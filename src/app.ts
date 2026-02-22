import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/index.js';
import { router } from './routes/index.js';
import { logger } from './services/logger/logger.js';

const app = express();

const corsOptions = {
  //TODO: Brittle. Fix it!
  origin: 'http://localhost:8080',
  credentials: true,
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(router);

async function start() {
  app.listen(config.PORT, () => {
    console.log(`[LOG] SYGA API listening on port ${config.PORT}`);
    logger.info('SYGA API started');
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});

export { app };
