import type { AbstractController } from '../abstract-controller';
import { AlgorithmRunner } from '../../services/algorithm-runner/algorithm-runner';
import { VisualizationRequest } from 'src/shared-types/visualization/VisualizationRequest';

class AlgorithmExecutor implements AbstractController {
  async handleRequest(visualizationRequest: VisualizationRequest) {
    const runner = new AlgorithmRunner();
    return runner.run(visualizationRequest);
  }
}

export const algorithmExecutor = new AlgorithmExecutor();
