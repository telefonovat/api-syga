import { config } from '#src/config/index.js';
import { pino } from 'pino';
import { createStream } from 'pino-seq';

const stream = createStream({
  serverUrl: config.SEQ_SERVER_URL,
  apiKey: config.SEQ_SERVER_API_KEY,
});

const logger = pino({ name: config.SEQ_NAME }, stream);
export { logger };
