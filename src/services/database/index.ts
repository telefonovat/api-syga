import { AlgorithmRetriever } from './algorithm-retriever';
import { Database } from './Database';
import { uri } from './secret';

const DB_NAME: string = 'syga';

const database = new Database(uri, DB_NAME);
const algorithmRetriever = new AlgorithmRetriever(database);

export { algorithmRetriever };
