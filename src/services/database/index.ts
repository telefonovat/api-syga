import { AlgorithmRetriever } from './algorithm-retriever';
import { UserDatabase } from './UserDatabase';
import { uri } from './secret';
import { config } from 'src/config';

const DB_NAME: string = 'syga';

if (!config.MONGODB_URL) {
  throw new Error('Mongodb connection string is empty...');
}

const userDatabase = new UserDatabase(config.MONGODB_URL);

export { userDatabase };
