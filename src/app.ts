import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';

import { config } from './config';

import { router } from './routes';
import { validateConfig } from './startup';
import { connectToDatabase } from './services/database';
import path from 'path';

validateConfig(config);

const app = express();

const corsOptions = {
  //TODO: Brittle. Fix it!
  origin: 'http://localhost:8123',
  credentials: true,
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(router);

const key = fs.readFileSync(
  path.join(__dirname, '../ssl_cert/api-syga-key.pem'),
);
const cert = fs.readFileSync(
  path.join(__dirname, '../ssl_cert/api-syga.pem'),
);

async function start() {
  await connectToDatabase();
  app.listen(config.PORT, () => {
    console.log(`[LOG] SYGA API listening on port ${config.PORT}`);
  });
  // https.createServer({ key, cert }, app).listen(config.PORT, () => {
  //   console.log(
  //     `[LOG] Backend running at https://localhost:${config.PORT}`,
  //   );
  // });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});

export { app };
