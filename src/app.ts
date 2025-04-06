import express, { json } from 'express';
import cors from 'cors';

import { config } from './config';

import { router } from './routes';
import { validateConfig } from './startup';

validateConfig(config);

const app = express();

app.use(json());
app.use(cors());

app.use(router);

app.listen(config.PORT, () => {
  console.log(`Example app listening on port ${config.PORT}`);
});

export { app };
