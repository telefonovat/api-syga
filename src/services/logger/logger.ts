import { config } from '#src/config/index.js';
import { pino, Logger } from 'pino';
import { createStream } from 'pino-seq';

function getLogger() {
  const shouldSendToSeq =
    Boolean(config.SEQ_NAME) &&
    Boolean(config.SEQ_SERVER_URL) &&
    Boolean(config.SEQ_SERVER_API_KEY);

  let logger: Logger;
  if (shouldSendToSeq) {
    const stream = createStream({
      serverUrl: config.SEQ_SERVER_URL,
      apiKey: config.SEQ_SERVER_API_KEY,
    });
    logger = pino({ name: config.SEQ_NAME }, stream);
    logger.info(`Logger started in production mode`);
  } else {
    logger = pino({ name: 'LOCAL' });
    logger.info(`Logger started locally. No logs will be sent`);
  }
  return logger;
}

const logger = getLogger();

export { logger };
