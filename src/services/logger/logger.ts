import { pino } from 'pino';

(async () => {
  const pinoSeq = require('pino-seq');
  console.log('Done');
})();
// Create a stream to Seq
// const stream = createStream({
//   serverUrl: 'http://localhost:5341',
//   apiKey: 'your-api-key', // optional
// });
//
// // Create a Pino logger
// const logger = pino({ name: 'pino-seq example' }, stream);

export { logger };
