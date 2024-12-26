import { AlgorithmExecutor } from './algorithm-executor';
import { AlgorithmDetailsGetter } from './algorithm-details-getter';
import { AlgorithmDetailsUpdater } from './algorithm-details-updater';
const algorithmExecutor = new AlgorithmExecutor();
const algorithmDetailsGetter = new AlgorithmDetailsGetter();
const algorithmDetailsUpdater = new AlgorithmDetailsUpdater();

export {
  algorithmExecutor,
  algorithmDetailsGetter,
  algorithmDetailsUpdater,
};
