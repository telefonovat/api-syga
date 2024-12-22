import { AlgorithmExecutor } from './algorithm-executor';
import { AlgorithmGetter } from './algorithm-getter';
import { AlgorithmUpdater } from './algorithm-updater';
const algorithmExecutor = new AlgorithmExecutor();
const algorithmGetter = new AlgorithmGetter();
const algorithmUpdater = new AlgorithmUpdater();

export { algorithmExecutor, algorithmGetter, algorithmUpdater };
